from datetime import datetime

from pydantic import BaseModel, ConfigDict

class SalesmanPatch(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    territory: str | None = None
    is_active: bool | None = None


class SalesmanCreate(BaseModel):
    name: str
    phone: str
    email: str
    address: str
    territory: str
    password: str
    is_active: bool = True

   

class SalesmanUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    territory: str | None = None
    is_active: bool | None = None


class SalesmanResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str
    address: str
    territory: str
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)