from fastapi import APIRouter
from models.patient import Patient
from config.db import db
from schemas.patient import patientEntity, patientsEntity
from fastapi import HTTPException

patient = APIRouter()


@patient.get("/patient")
async def find_all_patients():
    print(patientsEntity(db.metaphase.patient.find()))
    return patientsEntity(db.metaphase.patient.find())

@patient.post("/new_patient")
def register_patient(patient: Patient):
    print(patient)
    db.metaphase.patient.insert_one(dict(patient))
    raise HTTPException(
        status_code=201,
        detail=f"User with id {patient.name} registered."
    )