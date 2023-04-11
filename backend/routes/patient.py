from fastapi import APIRouter
from models.patient import Patient
from config.db import conn
from schemas.patient import patientEntity, patientsEntity
from fastapi import HTTPException

patient = APIRouter()

@patient.get("/patient")
async def find_all_patients():
    return patientsEntity(conn.metaphase.patient.find())

@patient.post("/new_patient")
def register_patient(patient: Patient):
    conn.metaphase.patient.insertOne(patient)
    raise HTTPException(
        status_code=201,
        detail=f"User with id {user.id} registered."
    )