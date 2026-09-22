from datetime import date, time, datetime

from pydantic import BaseModel, Field


class AttendanceCreate(BaseModel):
    salesman_id: int
    status: str = Field(default="Present", min_length=1, max_length=20)
    remarks: str | None = Field(default=None, max_length=255)

class AttendanceCheckOut(BaseModel):
    salesman_id: int

class AttendanceUpdate(BaseModel):
    attendance_date: date

    check_in: time | None = None

    check_out: time | None = None

    status: str = Field(
        min_length=1,
        max_length=20
    )

    remarks: str | None = Field(
        default=None,
        max_length=255
    )


class AttendanceResponse(BaseModel):
    id: int
    salesman_id: int
    attendance_date: date
    check_in: time | None
    check_out: time | None
    status: str
    remarks: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }