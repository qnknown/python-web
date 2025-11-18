from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User
from schemas import RegisterRequest, AuthRequest, TokenResponse
from auth import hash_password, verify_password, create_access_token
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=TokenResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_name == req.user_name).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    existing_email = db.query(User).filter(User.email == req.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        user_name=req.user_name,
        email=req.email,
        password_hash=hash_password(req.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.user_name, "role": user.role})

    return TokenResponse(
        access_token=token, #asdas
        role=user.role
    )


@app.post("/auth", response_model=TokenResponse)
def auth_user(req: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.user_name == req.user_name).first()
    if not user:
        raise HTTPException(status_code=400, detail="User not found")

    if not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": user.user_name, "role": user.role})

    return TokenResponse(
        access_token=token,
        role=user.role
    )