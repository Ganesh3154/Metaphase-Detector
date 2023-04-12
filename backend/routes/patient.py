from fastapi import APIRouter, status
from models.patient import Patient
from config.db import db
from schemas.patient import patientEntity, patientsEntity
from fastapi import HTTPException
from bson.objectid import ObjectId

patient = APIRouter()


@patient.get("/patient")
async def find_all_patients():
    print(patientsEntity(db.metaphase.patient.find()))
    return patientsEntity(db.metaphase.patient.find())

@patient.post("/patient", status_code=status.HTTP_201_CREATED)
def register_patient(patient: Patient) -> dict:
    print(patient)
    db.metaphase.patient.insert_one(dict(patient))
    return {'msg':f"Patient {patient.name} registered."}

@patient.delete('/patient/{id}', status_code=status.HTTP_204_NO_CONTENT)
def delete_patient(id):
    print(id)
    db.metaphase.patient.delete_one({'_id': ObjectId(id)})
    return {'msg':f"Patient with id {id} deleted."}
