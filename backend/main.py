from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends ,HTTPException, Query
from models.salesman import Salesman
from models.sales_performance import SalesPerformance
from models.leave_records import LeaveRecord
from sqlalchemy.exc import IntegrityError 
from sqlalchemy import or_
from models.sales_performance import SalesPerformance
from models.Attendance import Attendance
from datetime import date , datetime

from models.leave_records import LeaveRecord
from schemas.leave_record import (
    LeaveRecordCreate,
    LeaveRecordUpdate,
    LeaveRecordResponse)
from schemas.attandance import ( 
    AttendanceResponse,
    AttendanceCreate,
    AttendanceCheckOut)

from schemas.sales_performance import (
    SalesPerformanceCreate,
    SalesPerformanceResponse,
    SalesPerformanceUpdate,
    SalesPerformancePatch,
    SalesPerformanceSummary
)
from schemas.salesman import (
    SalesmanCreate,
    SalesmanResponse,
    SalesmanUpdate,
    SalesmanPatch,
    
)
from database import get_db


app = FastAPI(title="iTeams API",
    description="HR and Salesman Management API",
    version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post(
    "/attendance/mark-absent",
    response_model=AttendanceResponse,
    status_code=201
)
def mark_absent(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db)
):
    salesman = (
        db.query(Salesman)
        .filter(
            Salesman.id == attendance_data.salesman_id
        )
        .first()
    )

    if not salesman:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    today = date.today()

    existing_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.salesman_id
            == attendance_data.salesman_id,
            Attendance.attendance_date
            == today
        )
        .first()
    )

    if existing_attendance:
        raise HTTPException(
            status_code=400,
            detail="Attendance already exists for today"
        )

    attendance = Attendance(
        salesman_id=attendance_data.salesman_id,
        attendance_date=today,
        check_in=None,
        check_out=None,
        status="Absent",
        remarks=attendance_data.remarks,
    )

    db.add(attendance)
    db.commit()
    db.refresh(attendance)

    return attendance

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{id}")
def testing(id:str):
    return {"message": f"this is my first api-{id}"}

@app.get("/salesmen", response_model=list[SalesmanResponse])
def get_salesmen(page: int = Query(1, ge=1),
                limit: int = Query(10,  ge=1, le=100),
                search: str | None = None,
                db: Session = Depends(get_db)

    ):

    query = db.query(Salesman)

    if search:
        search_value = f"%{search}%"

        query = query.filter(
            or_(
                Salesman.name.ilike(search_value),
                Salesman.email.ilike(search_value),
                Salesman.territory.ilike(search_value)
            )
        )

    offset = (page - 1) * limit

    salesmen = (
        db.query(Salesman)
        .offset(offset)
        .limit(limit)
        .all()
    )

    return salesmen

@app.get("/salesmen/{salesman_id}", response_model=SalesmanResponse)
def get_salesman(salesman_id: int, db: Session = Depends(get_db)):

    salesman = db.query(Salesman).filter(
        Salesman.id == salesman_id
    ).first()

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    return salesman

from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError





@app.post("/salesmen", response_model=SalesmanResponse, status_code=201)
def create_salesman(
    salesman_data: SalesmanCreate,
    db: Session = Depends(get_db)
):
    salesman = Salesman(
        name=salesman_data.name,
        phone=salesman_data.phone,
        email=salesman_data.email,
        address=salesman_data.address,
        territory=salesman_data.territory,
        password_hash=salesman_data.password,
        is_active=salesman_data.is_active
    )

    db.add(salesman)

    try:
        db.commit()
        db.refresh(salesman)

    except IntegrityError:
        db.rollback()

        raise HTTPException(
            status_code=400,
            detail="Phone or email already exists"
        )

    return salesman

@app.put("/salesmen/{salesman_id}", response_model=SalesmanResponse)
def update_salesman(
    salesman_id: int,
    salesman_data: SalesmanUpdate,
    db: Session = Depends(get_db)
):
    salesman = db.query(Salesman).filter(
        Salesman.id == salesman_id
    ).first()

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    salesman.name = salesman_data.name
    salesman.phone = salesman_data.phone
    salesman.email = salesman_data.email
    salesman.address = salesman_data.address
    salesman.territory = salesman_data.territory
    salesman.is_active = salesman_data.is_active

    db.commit()
    db.refresh(salesman)

    return salesman

@app.delete("/salesmen/{salesman_id}", status_code=204)
def delete_salesman(
    salesman_id: int,
    db: Session = Depends(get_db)
):
    salesman = db.query(Salesman).filter(
        Salesman.id == salesman_id
    ).first()

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    db.delete(salesman)
    db.commit()

    return {
        "message": "Salesman deleted successfully"
    }

@app.patch("/salesmen/{salesman_id}", response_model=SalesmanResponse)
def patch_salesman(salesman_id: int,    salesman_data: SalesmanPatch,    db: Session = Depends(get_db)):
    salesman = db.query(Salesman).filter(
        Salesman.id == salesman_id
    ).first()

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    update_data = salesman_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(salesman, field, value)

    db.commit()
    db.refresh(salesman)

    return salesman

@app.post(
    "/sales-performance",
    response_model=SalesPerformanceResponse,
    status_code=201
)
def create_sales_performance(
    performance_data: SalesPerformanceCreate,
    db: Session = Depends(get_db)
):
    salesman = db.query(Salesman).filter(
        Salesman.id == performance_data.salesman_id
    ).first()

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    performance = SalesPerformance(
        salesman_id=performance_data.salesman_id,
        period=performance_data.period,
        target=performance_data.target,
        achievement=performance_data.achievement
    )

    db.add(performance)

    db.commit()
    db.refresh(performance)

    return performance


@app.get(
    "/sales-performance",
    response_model=list[SalesPerformanceResponse]
)
def get_sales_performances(
    db: Session = Depends(get_db)
):
    performances = (
        db.query(SalesPerformance)
        .all()
    )

    return performances

@app.get(
    "/salesmen/{salesman_id}/performance",
    response_model=list[SalesPerformanceResponse]
)
def get_salesman_performance(
    salesman_id: int,
    db: Session = Depends(get_db)
):
    salesman = (
        db.query(Salesman)
        .filter(
            Salesman.id == salesman_id
        )
        .first()
    )

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    performances = (
        db.query(SalesPerformance)
        .filter(
            SalesPerformance.salesman_id == salesman_id
        )
        .all()
    )

    return performances

@app.put(
    "/salesmen/{salesman_id}/performance/{period}",
    response_model=SalesPerformanceResponse
)
def update_sales_performance(
    salesman_id: int,
    period: str,
    performance_data: SalesPerformanceUpdate,
    db: Session = Depends(get_db)
):
    salesman = (
        db.query(Salesman)
        .filter(Salesman.id == salesman_id)
        .first()
    )

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    performance = (
        db.query(SalesPerformance)
        .filter(
            SalesPerformance.salesman_id == salesman_id,
            SalesPerformance.period == period
        )
        .first()
    )

    if performance is None:
        raise HTTPException(
            status_code=404,
            detail="Sales performance not found"
        )

    performance.period = performance_data.period
    performance.target = performance_data.target
    performance.achievement = performance_data.achievement

    db.commit()
    db.refresh(performance)

    return performance

@app.delete(
    "/sales-performance/{performance_id}",
    status_code=204
)
def delete_sales_performance(
    performance_id: int,
    db: Session = Depends(get_db)
):
    performance = (
        db.query(SalesPerformance)
        .filter(
            SalesPerformance.id == performance_id
        )
        .first()
    )

    if performance is None:
        raise HTTPException(
            status_code=404,
            detail="Sales performance not found"
        )

    db.delete(performance)
    db.commit()

    return


@app.patch(
    "/sales-performance/{performance_id}",
    response_model=SalesPerformanceResponse
)
def patch_sales_performance(
    performance_id: int,
    performance_data: SalesPerformancePatch,
    db: Session = Depends(get_db)
):
    performance = (
        db.query(SalesPerformance)
        .filter(
            SalesPerformance.id == performance_id
        )
        .first()
    )

    if performance is None:
        raise HTTPException(
            status_code=404,
            detail="Sales performance not found"
        )

    update_data = performance_data.model_dump(
        exclude_unset=True
    )

    new_target = update_data.get(
        "target",
        performance.target
    )

    new_achievement = update_data.get(
        "achievement",
        performance.achievement
    )

    if new_achievement > new_target:
        raise HTTPException(
            status_code=400,
            detail="Achievement cannot be greater than target"
        )

    for field, value in update_data.items():
        setattr(performance, field, value)

    db.commit()
    db.refresh(performance)



    return performance

@app.get(
    "/salesmen/{salesman_id}/performance-summary",
    response_model=SalesPerformanceSummary
)
def get_salesman_performance_summary(
    salesman_id: int,
    db: Session = Depends(get_db)
):
    salesman = (
        db.query(Salesman)
        .filter(
            Salesman.id == salesman_id
        )
        .first()
    )

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    result = (
        db.query(
            func.sum(SalesPerformance.target).label(
                "total_target"
            ),
            func.sum(SalesPerformance.achievement).label(
                "total_achievement"
            )
        )
        .filter(
            SalesPerformance.salesman_id == salesman_id
        )
        .first()
    )

    total_target = result.total_target or 0
    total_achievement = result.total_achievement or 0

    if total_target == 0:
        achievement_percentage = 0
    else:
        achievement_percentage = (
            total_achievement / total_target
        ) * 100

    return {
        "salesman_id": salesman_id,
        "total_target": total_target,
        "total_achievement": total_achievement,
        "achievement_percentage": achievement_percentage
    }


@app.post(
    "/attendance/check-in",
    response_model=AttendanceResponse,
    status_code=201
)
def check_in(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db)
):

    # 1. Check salesman exists
    salesman = (
        db.query(Salesman)
        .filter(Salesman.id == attendance_data.salesman_id)
        .first()
    )

    if salesman is None:
        raise HTTPException(
            status_code=404,
            detail="Salesman not found"
        )

    # 2. Get current date
    today = date.today()

    # 3. Get current time
    current_time = datetime.now().time()

    # 4. Check whether attendance already exists today
    existing_attendance = (
        db.query(Attendance)
        .filter(
            Attendance.salesman_id == attendance_data.salesman_id,
            Attendance.attendance_date == today
        )
        .first()
    )

    if existing_attendance is not None:
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for today"
        )

    # 5. Create attendance
    attendance = Attendance(
        salesman_id=attendance_data.salesman_id,
        attendance_date=today,
        check_in=current_time,
        status=attendance_data.status,
        remarks=attendance_data.remarks
    )

    db.add(attendance)

    # 6. Save to database
    try:
        db.commit()
        db.refresh(attendance)

    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail="Attendance already marked for today"
        )

    return attendance
from datetime import date, datetime


@app.post(
    "/attendance/check-out",
    response_model=AttendanceResponse
)
def check_out(
    attendance_data: AttendanceCheckOut,
    db: Session = Depends(get_db)
):

    # 1. Find today's attendance
    today = date.today()

    attendance = (
        db.query(Attendance)
        .filter(
            Attendance.salesman_id == attendance_data.salesman_id,
            Attendance.attendance_date == today
        )
        .first()
    )

    # 2. Attendance not found
    if attendance is None:
        raise HTTPException(
            status_code=404,
            detail="Today's attendance not found. Please check in first."
        )

    # 3. Already checked out
    if attendance.check_out is not None:
        raise HTTPException(
            status_code=400,
            detail="You have already checked out today."
        )

    # 4. Set current time
    attendance.check_out = datetime.now().time()

    # 5. Save
    db.commit()
    db.refresh(attendance)

    return attendance


# // LeaveRecord


@app.get(
    "/salesmen/{salesman_id}/leave-records",
    response_model=list[LeaveRecordResponse]
)
def get_salesman_leave_records(
    salesman_id: int,
    db: Session = Depends(get_db)
):
    leaves = (
        db.query(LeaveRecord)
        .filter(LeaveRecord.salesman_id == salesman_id)
        .all()
    )

    return leaves


@app.put(
    "/leave-records/{leave_id}",
    response_model=LeaveRecordResponse
)
def update_leave_record(
    leave_id: int,
    leave_data: LeaveRecordUpdate,
    db: Session = Depends(get_db)
):
    leave = (
        db.query(LeaveRecord)
        .filter(LeaveRecord.id == leave_id)
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave record not found"
        )

    leave.salesman_id = leave_data.salesman_id
    leave.leave_date = leave_data.leave_date
    leave.leave_type = leave_data.leave_type
    leave.status = leave_data.status
    leave.reason = leave_data.reason

    db.commit()
    db.refresh(leave)

    return leave


@app.delete(
    "/leave-records/{leave_id}",
    status_code=204
)
def delete_leave_record(
    leave_id: int,
    db: Session = Depends(get_db)
):
    leave = (
        db.query(LeaveRecord)
        .filter(LeaveRecord.id == leave_id)
        .first()
    )

    if not leave:
        raise HTTPException(
            status_code=404,
            detail="Leave record not found"
        )

    db.delete(leave)
    db.commit()

    return None