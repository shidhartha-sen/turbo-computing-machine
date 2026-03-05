import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.v1.routes.auth import get_current_user_id
from app.db.session import get_db
from app.models.models import Conversation, ConversationParticipant, Listing, User
from app.schemas.schemas import ConversationCreate, ConversationOut

router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("/me", response_model=list[ConversationOut])
def get_my_conversations(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    participants = (
        db.query(ConversationParticipant)
        .filter(ConversationParticipant.user_id == uuid.UUID(user_id))
        .all()
    )
    conversation_ids = [p.conversation_id for p in participants]
    return (
        db.query(Conversation)
        .filter(Conversation.id.in_(conversation_ids))
        .order_by(Conversation.created_at.desc())
        .all()
    )


@router.post("", response_model=ConversationOut, status_code=201)
def create_conversation(
    payload: ConversationCreate,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if not db.query(Listing).filter(Listing.id == payload.listing_id).first():
        raise HTTPException(status_code=404, detail="Listing not found")

    # Ensure the current user is always a participant
    participant_ids = list({uuid.UUID(user_id), *payload.participant_ids})

    for uid in participant_ids:
        if not db.query(User).filter(User.user_id == uid).first():
            raise HTTPException(status_code=404, detail=f"User {uid} not found")

    conversation = Conversation(listing_id=payload.listing_id)
    db.add(conversation)
    db.flush()

    for uid in participant_ids:
        db.add(ConversationParticipant(conversation_id=conversation.id, user_id=uid))

    db.commit()
    db.refresh(conversation)
    return conversation


@router.get("/{conversation_id}", response_model=ConversationOut)
def get_conversation(conversation_id: uuid.UUID, db: Session = Depends(get_db)):
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation


@router.get("/user/{user_id}", response_model=list[ConversationOut])
def get_user_conversations(user_id: uuid.UUID, db: Session = Depends(get_db)):
    if not db.query(User).filter(User.user_id == user_id).first():
        raise HTTPException(status_code=404, detail="User not found")
    participants = (
        db.query(ConversationParticipant)
        .filter(ConversationParticipant.user_id == user_id)
        .all()
    )
    conversation_ids = [p.conversation_id for p in participants]
    return (
        db.query(Conversation)
        .filter(Conversation.id.in_(conversation_ids))
        .order_by(Conversation.created_at.desc())
        .all()
    )
