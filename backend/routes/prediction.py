
from datetime import date
from calendar import monthrange

import joblib
import pandas as pd

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db

from models.sales_performance import SalesPerformance
from models.Attendance import Attendance
from models.leave_records import LeaveRecord

from schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    DatabasePredictionResponse
)


router = APIRouter()


# ==================================================
# Load ML model once
# ==================================================

model = joblib.load(
    "ml/sales_prediction_model.pkl"
)


# ==================================================
# 1. Manual Prediction API
# ==================================================

@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_sales(data: PredictionRequest):

    # ----------------------------------------------
    # Create DataFrame for ML model
    # ----------------------------------------------

    input_df = pd.DataFrame([{
        "target": data.target,
        "present_days": data.present_days,
        "late_days": data.late_days,
        "absent_days": data.absent_days,
        "approved_leave_days": data.approved_leave_days
    }])

    # ----------------------------------------------
    # Make prediction
    # ----------------------------------------------

    prediction = model.predict(input_df)

    # ----------------------------------------------
    # Return prediction
    # ----------------------------------------------

    return {
        "predicted_achievement": round(
            float(prediction[0]),
            2
        )
    }


# ==================================================
# 2. Database → ML Prediction API
# ==================================================

@router.post(
    "/predict/{salesman_id}",
    response_model=DatabasePredictionResponse
)
def predict_sales_from_database(
    salesman_id: int,
    month: str,
    db: Session = Depends(get_db)
):

    # ==================================================
    # Step 1: Get sales performance
    # ==================================================

    performance = db.query(
        SalesPerformance
    ).filter(
        SalesPerformance.salesman_id == salesman_id,
        SalesPerformance.period == month
    ).first()

    if not performance:
        return {
            "message": "Sales performance data not found"
        }


    # ==================================================
    # Step 2: Convert month into dates
    #
    # Example:
    # month = "2025-10"
    #
    # start_date = 2025-10-01
    # end_date   = 2025-10-31
    # ==================================================

    year, month_number = map(
        int,
        month.split("-")
    )

    start_date = date(
        year,
        month_number,
        1
    )

    last_day = monthrange(
        year,
        month_number
    )[1]

    end_date = date(
        year,
        month_number,
        last_day
    )


    # ==================================================
    # Step 3: Get attendance records
    # ==================================================

    attendance_records = db.query(
        Attendance
    ).filter(
        Attendance.salesman_id == salesman_id,
        Attendance.attendance_date >= start_date,
        Attendance.attendance_date <= end_date
    ).all()


    # ==================================================
    # Step 4: Count attendance status
    # ==================================================

    present_days = sum(
        1
        for record in attendance_records
        if record.status == "Present"
    )

    late_days = sum(
        1
        for record in attendance_records
        if record.status == "Late"
    )

    absent_days = sum(
        1
        for record in attendance_records
        if record.status == "Absent"
    )


    # ==================================================
    # Step 5: Get approved leave days
    # ==================================================

    approved_leave_days = db.query(
        LeaveRecord
    ).filter(
        LeaveRecord.salesman_id == salesman_id,
        LeaveRecord.leave_date >= start_date,
        LeaveRecord.leave_date <= end_date,
        LeaveRecord.status == "Approved"
    ).count()


    # ==================================================
    # Step 6: Prepare input for ML model
    # ==================================================

    input_df = pd.DataFrame([{
        "target": float(performance.target),
        "present_days": present_days,
        "late_days": late_days,
        "absent_days": absent_days,
        "approved_leave_days": approved_leave_days
    }])


    # ==================================================
    # Step 7: Make prediction
    # ==================================================

    prediction = model.predict(
        input_df
    )


    # ==================================================
    # Step 8: Calculate actual and difference
    # ==================================================

    predicted_achievement = round(
        float(prediction[0]),
        2
    )

    actual_achievement = round(
        float(performance.achievement),
        2
    )

    difference = round(
        actual_achievement - predicted_achievement,
        2
    )


    # ==================================================
    # Step 9: Return complete result
    # ==================================================

    return {
        "salesman_id": salesman_id,
        "month": month,

        "target": float(performance.target),

        "present_days": present_days,
        "late_days": late_days,
        "absent_days": absent_days,
        "approved_leave_days": approved_leave_days,

        "actual_achievement": actual_achievement,
        "predicted_achievement": predicted_achievement,
        "difference": difference
    }
