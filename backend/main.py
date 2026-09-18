from fastapi import FastAPI




app = FastAPI(title="iTeams API",
    description="HR and Salesman Management API",
    version="1.0.0")


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/users/{id}")
def testing(id:str):
    return {"message": f"this is my first api-{id}"}