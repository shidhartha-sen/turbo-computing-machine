import uuid
from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, EmailStr


# --- User ---

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    profile_image_url: str


class UserUpdate(BaseModel):
    name: str | None = None
    profile_image_url: str | None = None


class UserOut(BaseModel):
    user_id: uuid.UUID
    name: str
    email: str
    profile_image_url: str
    items_sold: int

    model_config = {"from_attributes": True}


# --- Listing Image ---

class ListingImageOut(BaseModel):
    id: uuid.UUID
    image_url: str

    model_config = {"from_attributes": True}


# --- Listing ---

class ListingCreate(BaseModel):
    title: str
    description: str
    location: str = ""
    price: Decimal = Decimal("0")
    condition: str = "good"
    category: str = "Other"
    price_type: str = "cash"
    meeting_location: str | None = None
    image_urls: list[str] = []


class ListingUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    location: str | None = None
    price: Decimal | None = None
    is_available: bool | None = None
    status: str | None = None
    expires_at: datetime | None = None


class ListingOut(BaseModel):
    id: uuid.UUID
    seller_id: uuid.UUID
    title: str
    description: str
    location: str
    price: Decimal
    created_at: datetime
    is_available: bool
    views_count: int = 0
    expires_at: datetime | None = None
    status: str = "active"
    condition: str = "good"
    category: str = "Other"
    price_type: str = "cash"
    meeting_location: str | None = None
    images: list[ListingImageOut] = []

    model_config = {"from_attributes": True}


class MyListingOut(ListingOut):
    active_chats: int = 0
    offers_count: int = 0


class MyListingsStats(BaseModel):
    active: int
    sold: int
    total_views: int


class ListingImageCreate(BaseModel):
    image_url: str


# --- Conversation ---

class ConversationCreate(BaseModel):
    listing_id: uuid.UUID
    participant_ids: list[uuid.UUID]


class ParticipantOut(BaseModel):
    user_id: uuid.UUID
    joined_at: datetime

    model_config = {"from_attributes": True}


class ConversationOut(BaseModel):
    id: uuid.UUID
    listing_id: uuid.UUID
    created_at: datetime
    # participants maps to ConversationParticipant rows
    participants: list[ParticipantOut] = []

    model_config = {"from_attributes": True}

    @classmethod
    def model_validate(cls, obj, **kwargs):
        # Remap ConversationParticipant rows to ParticipantOut
        data = {
            "id": obj.id,
            "listing_id": obj.listing_id,
            "created_at": obj.created_at,
            "participants": [
                ParticipantOut(user_id=p.user_id, joined_at=p.joined_at)
                for p in obj.participants
            ],
        }
        return cls(**data)


# --- Message ---

class MessageCreate(BaseModel):
    sender_id: uuid.UUID
    content: str


class MessageOut(BaseModel):
    id: uuid.UUID
    conversation_id: uuid.UUID
    sender_id: uuid.UUID
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
