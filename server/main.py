from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
from models import User, Order, OrderItem
from schemas import RegisterRequest, AuthRequest, TokenResponse, OrderCreate, OrderResponse, OrderRead
from auth import hash_password, verify_password, create_access_token, decode_access_token
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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)
    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user = db.query(User).filter(User.user_name == username).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

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

@app.post("/orders", response_model=OrderResponse)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    total_price = sum(item.price * item.quantity for item in order.items)
    
    db_order = Order(
        name=order.name,
        phone=order.phone,
        email=order.email,
        address=order.address,
        delivery_method=order.delivery_method,
        warehouse=order.warehouse,
        total_price=total_price
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    for item in order.items:
        db_item = OrderItem(
            order_id=db_order.id,
            product_name=item.product_name,
            quantity=item.quantity,
            price=item.price
        )
        db.add(db_item)
    
    db.commit()
    
    return OrderResponse(id=db_order.id, message="Order created successfully")

@app.get("/orders/my", response_model=List[OrderRead])
def get_my_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Order).filter(Order.email == current_user.email).all()