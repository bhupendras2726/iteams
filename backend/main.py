from fastapi import FastAPI
from models.salesman import Salesman
from models.sales_performance import SalesPerformance
from models.leave_records import LeaveRecord



app = FastAPI(title="iTeams API",
    description="HR and Salesman Management API",
    version="1.0.0")


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{id}")
def testing(id:str):
    return {"message": f"this is my first api-{id}"}