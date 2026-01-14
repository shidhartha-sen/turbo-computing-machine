from fastapi import FastAPI
from app.api.v1.routes import health

app = FastAPI(
    title="Project API",
    version="1.0.0"
)


app.include_router(
    health.router,
    prefix="/api/v1",
    tags=["health"]
)

