from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Doctor(BaseModel):
    name: str
    hospital: str       
    department: str
    age: int
    gender: str

doctors ={ 
    0: Doctor(name='John', hospital='KIMS', department='Cardiology', age=28, gender='Male'),
    1: Doctor(name='Doe', hospital='COSMO', department='Respiratory', age=30, gender='Male'),
    2: Doctor(name='Mary', hospital='NIMS', department='Neuro', age=28, gender='Female')
}

@app.get("/")
def index() -> dict[int, Doctor]:
    return doctors