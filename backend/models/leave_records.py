from datetime import date

from sqlalchemy import Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class LeaveRecord(Base):
    __tablename__ = "leave_records"

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

    leave_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    leave_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="Pending"
    )

    reason: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    # Relationship
    salesman = relationship(
        "Salesman",
        back_populates="leave_records"
    )