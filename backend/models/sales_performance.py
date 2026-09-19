from datetime import datetime
from decimal import Decimal

from sqlalchemy import DateTime, ForeignKey, Integer, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class SalesPerformance(Base):
    __tablename__ = "sales_performance"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    salesman_id: Mapped[int] = mapped_column(
        ForeignKey("salesmen.id"),
        nullable=False,
        index=True
    )

    period: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    target: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    achievement: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(), nullable= False
    )

    # Relationship
    salesman = relationship(
        "Salesman",
        back_populates="performances"
    )