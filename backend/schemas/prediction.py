
from pydantic import BaseModel


# ==================================================
# Request Schema
# ==================================================

class PredictionRequest(BaseModel):

    target: float
    present_days: int
    late_days: int
    absent_days: int
    approved_leave_days: int


# ==================================================
# Response Schema
# ==================================================

class PredictionResponse(BaseModel):

    predicted_achievement: float


# ==================================================
# Database Prediction Response
# ==================================================

class DatabasePredictionResponse(BaseModel):

    salesman_id: int
    month: str

    target: float

    present_days: int
    late_days: int
    absent_days: int
    approved_leave_days: int

    actual_achievement: float
    predicted_achievement: float
    difference: float

