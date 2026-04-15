from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config import connect_db, close_db, settings
from api.routes.auth_routes import router as auth_router
from api.routes.user_routes import router as user_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB connection
    await connect_db()
    yield
    # Shutdown: Clean up DB connection
    await close_db()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Road App API with authentication",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api/v1")
app.include_router(user_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Welcome to Road App API",
        "version": settings.VERSION,
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# NOTE: The if __name__ == "__main__" block has been removed.
# Control the server from your terminal instead.