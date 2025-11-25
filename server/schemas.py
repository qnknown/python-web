from pydantic import BaseModel

from typing import List, Optional

class RegisterRequest(BaseModel):
    user_name: str
    email: str
    password: str

class AuthRequest(BaseModel):
    user_name: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str

class OrderItemCreate(BaseModel):
    product_name: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: Optional[str] = None
    delivery_method: str
    warehouse: Optional[str] = None
    items: List[OrderItemCreate]

class OrderResponse(BaseModel):
    id: int
    message: str

class OrderItemRead(BaseModel):
    product_name: str
    quantity: int
    price: float

    class Config:
        orm_mode = True

class OrderRead(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    address: Optional[str] = None
    delivery_method: str
    warehouse: Optional[str] = None
    total_price: float
    items: List[OrderItemRead] = []

    class Config:
        orm_mode = True
