from datetime import date

from pydantic import BaseModel, Field


class LeaveRecordCreate(BaseModel):
    salesman_id: int

    leave_date: date

    leave_type: str = Field(
        min_length=1,
        max_length=50
    )

    status: str = Field(
        default="Pending",
        min_length=1,
        max_length=30
    )

    reason: str | None = Field(
        default=None,
        max_length=255
    )


class LeaveRecordUpdate(BaseModel):
    salesman_id: int

    leave_date: date

    leave_type: str = Field(
        min_length=1,
        max_length=50
    )

    status: str = Field(
        min_length=1,
        max_length=30
    )

    reason: str | None = Field(
        default=None,
        max_length=255
    )


class LeaveRecordResponse(BaseModel):
    id: int
    salesman_id: int
    leave_date: date
    leave_type: str
    status: str
    reason: str | None

    model_config = {
        "from_attributes": True
    }