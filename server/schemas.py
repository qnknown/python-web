from pydantic import BaseModel

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
