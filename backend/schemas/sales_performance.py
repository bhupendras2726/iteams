from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field

class SalesPerformanceSummary(BaseModel):
    salesman_id: int
    total_target: Decimal
    total_achievement: Decimal
    achievement_percentage: Decimal

class SalesPerformancePatch(BaseModel):
    period: str | None = Field(
        default=None,
        min_length=1,
        max_length=20
    )

    target: Decimal | None = Field(
        default=None,
        gt=0
    )

    achievement: Decimal | None = Field(
        default=None,
        ge=0
    )


class SalesPerformanceCreate(BaseModel):
    salesman_id: int
    period: str = Field(min_length=1, max_length=20)
    target: Decimal = Field(gt=0)
    achievement: Decimal = Field(ge=0)
    
class SalesPerformanceUpdate(BaseModel):
    salesman_id: int
    period: str = Field(min_length=1, max_length=20)
    target: Decimal = Field(gt=0)
    achievement: Decimal = Field(ge=0)

class SalesPerformanceResponse(BaseModel):
    id: int
    salesman_id: int
    period: str
    target: Decimal
    achievement: Decimal
    created_at: datetime

    model_config = {
        "from_attributes": True
    }