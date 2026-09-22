from datetime import date, datetime, time

from sqlalchemy import (
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Time,
    UniqueConstraint
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database import Base


class Attendance(Base):
    __tablename__ = "attendance"

    __table_args__ = (
        UniqueConstraint(
            "salesman_id",
            "attendance_date",
            name="uq_salesman_attendance_date"
        ),
    )

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

    attendance_date: Mapped[date] = mapped_column(
        Date,
        nullable=False
    )

    check_in: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    check_out: Mapped[time | None] = mapped_column(
        Time,
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default="Present"
    )

    remarks: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now,
        nullable=False
    )

    salesman = relationship(
        "Salesman",
        back_populates="attendance_records"
    )