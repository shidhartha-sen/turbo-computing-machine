import uuid

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.api.v1.routes.auth import get_current_user_id
from app.db.session import get_db
from app.models.models import Conversation, ConversationParticipant, Message
from app.schemas.schemas import MessageOut

router = APIRouter(prefix="/conversations/{conversation_id}/messages", tags=["messages"])


class SendMessageRequest(BaseModel):
    text: str


@router.post("", response_model=MessageOut, status_code=201)
def send_message(
    conversation_id: uuid.UUID,
    payload: SendMessageRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
):
    if not db.query(Conversation).filter(Conversation.id == conversation_id).first():
        raise HTTPException(status_code=404, detail="Conversation not found")

    is_participant = (
        db.query(ConversationParticipant)
        .filter(
            ConversationParticipant.conversation_id == conversation_id,
            ConversationParticipant.user_id == uuid.UUID(user_id),
        )
        .first()
    )
    if not is_participant:
        raise HTTPException(status_code=403, detail="Sender is not a participant")

    message = Message(
        conversation_id=conversation_id,
        sender_id=uuid.UUID(user_id),
        content=payload.text,
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("", response_model=list[MessageOut])
def get_messages(conversation_id: uuid.UUID, db: Session = Depends(get_db)):
    if not db.query(Conversation).filter(Conversation.id == conversation_id).first():
        raise HTTPException(status_code=404, detail="Conversation not found")
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )
