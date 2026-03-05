import uuid
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()

ALLOWED_DOMAIN = "usask.ca"


# ── Schemas ───────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    password: str


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    name: str
    email: str


# ── Helpers ───────────────────────────────────────────────────────────────────

def _check_domain(email: str):
    if not email.lower().endswith(f"@{ALLOWED_DOMAIN}"):
        raise HTTPException(status_code=403, detail="Only @usask.ca email addresses are allowed")


def _hash_password(password: str) -> str:
    return pwd_context.hash(password)


def _verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)


def _create_token(user_id: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "exp": expire},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM,
    )


def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM],
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid or expired token")


# ── Routes ────────────────────────────────────────────────────────────────────

@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    _check_domain(payload.email)

    existing = db.execute(
        text('SELECT id FROM neon_auth."user" WHERE email = :email'),
        {"email": payload.email},
    ).fetchone()
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)

    db.execute(
        text(
            'INSERT INTO neon_auth."user" (id, name, email, "emailVerified", "createdAt", "updatedAt") '
            "VALUES (:id, :name, :email, false, :now, :now)"
        ),
        {"id": user_id, "name": payload.name, "email": payload.email, "now": now},
    )
    db.execute(
        text(
            'INSERT INTO neon_auth.account '
            '(id, "accountId", "providerId", "userId", password, "createdAt", "updatedAt") '
            "VALUES (:id, :account_id, 'credential', :user_id, :password, :now, :now)"
        ),
        {
            "id": str(uuid.uuid4()),
            "account_id": payload.email,
            "user_id": user_id,
            "password": _hash_password(payload.password),
            "now": now,
        },
    )
    db.execute(
        text("INSERT INTO users (user_id, name, profile_image_url, items_sold) VALUES (:uid, :name, '', 0)"),
        {"uid": user_id, "name": payload.name},
    )
    db.commit()

    return TokenResponse(
        access_token=_create_token(user_id),
        user_id=user_id,
        name=payload.name,
        email=payload.email,
    )


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    _check_domain(payload.email)

    user_row = db.execute(
        text('SELECT id, name, email FROM neon_auth."user" WHERE email = :email'),
        {"email": payload.email},
    ).fetchone()
    if not user_row:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    account_row = db.execute(
        text('SELECT password FROM neon_auth.account WHERE "userId" = :uid AND "providerId" = \'credential\''),
        {"uid": user_row.id},
    ).fetchone()
    if not account_row or not _verify_password(payload.password, account_row.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return TokenResponse(
        access_token=_create_token(str(user_row.id)),
        user_id=str(user_row.id),
        name=user_row.name,
        email=user_row.email,
    )


@router.get("/me", response_model=TokenResponse)
def me(user_id: str = Depends(get_current_user_id), db: Session = Depends(get_db)):
    user_row = db.execute(
        text('SELECT name, email FROM neon_auth."user" WHERE id = :id'),
        {"id": uuid.UUID(user_id)},
    ).fetchone()
    if not user_row:
        raise HTTPException(status_code=404, detail="User not found")
    return TokenResponse(
        access_token=_create_token(user_id),
        user_id=user_id,
        name=user_row.name,
        email=user_row.email,
    )
