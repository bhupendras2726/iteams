from fastapi import FastAPI, Depends ,HTTPException
from models.salesman import Salesman
from models.sales_performance import SalesPerformance
from models.leave_records import LeaveRecord
from sqlalchemy.exc import IntegrityError
from schemas.salesman import (
    SalesmanCreate,
    SalesmanResponse,
    SalesmanUpdate,
    SalesmanPatch
)
from database import get_db


app = FastAPI(title="iTeams API",
    description="HR and Salesman Management API",
    version="1.0.0")


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{id}")
def testing(id:str):
    return {"message": f"this is my first api-{id}"}

@app.get("/salesmen", response_model=list[SalesmanResponse])
def get_salesmen(db: Session = Depends(get_db)):
    salesmen = db.query(Salesman).all()
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