from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.routes import auth, health, users, listings, conversations, messages

app = FastAPI(
    title="Project API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PREFIX = "/api/v1"

app.include_router(health.router, prefix=PREFIX, tags=["health"])
app.include_router(auth.router, prefix=PREFIX)
app.include_router(users.router, prefix=PREFIX)
app.include_router(listings.router, prefix=PREFIX)
app.include_router(conversations.router, prefix=PREFIX)
app.include_router(messages.router, prefix=PREFIX)
