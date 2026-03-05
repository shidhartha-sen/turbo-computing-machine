import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.api.v1.routes.auth import get_current_user_id
from app.db.session import get_db
from app.models.models import Conversation, Listing, ListingImage, Offer, User
from app.schemas.schemas import (
    ListingCreate, ListingImageCreate, ListingImageOut,
    ListingOut, ListingUpdate, MyListingOut, MyListingsStats,
)

router = APIRouter(prefix="/listings", tags=["listings"])


@router.get("/me/stats", response_model=MyListingsStats)
def my_stats(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    uid = uuid.UUID(user_id)
    active = db.query(func.count(Listing.id)).filter(
        Listing.seller_id == uid, Listing.status == "active"
    ).scalar() or 0
    sold = db.query(func.count(Listing.id)).filter(
        Listing.seller_id == uid, Listing.status.in_(["sold", "traded"])
    ).scalar() or 0
    total_views = db.query(func.sum(Listing.views_count)).filter(
        Listing.seller_id == uid
    ).scalar() or 0
    return MyListingsStats(active=active, sold=sold, total_views=total_views)


@router.get("/me", response_model=list[MyListingOut])
def my_listings(
    status: str | None = None,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    uid = uuid.UUID(user_id)
    q = db.query(Listing).filter(Listing.seller_id == uid)
    if status:
        if status == "sold":
            q = q.filter(Listing.status.in_(["sold", "traded"]))
        else:
            q = q.filter(Listing.status == status)
    listings = q.order_by(Listing.created_at.desc()).all()

    result = []
    for listing in listings:
        active_chats = db.query(func.count(Conversation.id)).filter(
            Conversation.listing_id == listing.id
        ).scalar() or 0
        offers_count = db.query(func.count(Offer.id)).filter(
            Offer.listing_id == listing.id, Offer.status == "pending"
        ).scalar() or 0
        out = MyListingOut(
            **ListingOut.model_validate(listing).model_dump(),
            active_chats=active_chats,
            offers_count=offers_count,
        )
        result.append(out)
    return result


@router.post("", response_model=ListingOut, status_code=201)
def create_listing(
    payload: ListingCreate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    uid = uuid.UUID(user_id)
    if not db.query(User).filter(User.user_id == uid).first():
        raise HTTPException(status_code=404, detail="User not found")

    data = payload.model_dump(exclude={"image_urls"})
    listing = Listing(seller_id=uid, **data)
    db.add(listing)
    db.flush()

    for url in payload.image_urls:
        db.add(ListingImage(listing_id=listing.id, image_url=url))

    db.commit()
    db.refresh(listing)
    return listing


@router.get("", response_model=list[ListingOut])
def list_listings(available_only: bool = False, db: Session = Depends(get_db)):
    q = db.query(Listing)
    if available_only:
        q = q.filter(Listing.status == "active")
    return q.order_by(Listing.created_at.desc()).all()


@router.get("/{listing_id}", response_model=ListingOut)
def get_listing(listing_id: uuid.UUID, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    # increment view count
    listing.views_count += 1
    db.commit()
    db.refresh(listing)
    return listing


@router.put("/{listing_id}", response_model=ListingOut)
def update_listing(
    listing_id: uuid.UUID,
    payload: ListingUpdate,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    for field, value in payload.model_dump(exclude_none=True).items():
        setattr(listing, field, value)
    db.commit()
    db.refresh(listing)
    return listing


@router.delete("/{listing_id}", status_code=204)
def delete_listing(
    listing_id: uuid.UUID,
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db),
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    db.delete(listing)
    db.commit()


@router.post("/{listing_id}/images", response_model=ListingImageOut, status_code=201)
def add_image(
    listing_id: uuid.UUID,
    payload: ListingImageCreate,
    db: Session = Depends(get_db),
):
    if not db.query(Listing).filter(Listing.id == listing_id).first():
        raise HTTPException(status_code=404, detail="Listing not found")
    image = ListingImage(listing_id=listing_id, image_url=payload.image_url)
    db.add(image)
    db.commit()
    db.refresh(image)
    return image
