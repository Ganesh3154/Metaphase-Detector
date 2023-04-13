from fastapi import APIRouter, status
from models.patient import Patient
from config.db import db
from schemas.patient import patientEntity, patientsEntity
from fastapi import HTTPException
from bson.objectid import ObjectId

patient = APIRouter()


@patient.get("/patient")
async def find_all_patients():
    print(patientsEntity(db.metaphase.patient.find().sort('_id',-1)))
    return patientsEntity(db.metaphase.patient.find().sort('_id',-1))

@patient.get('/recent_patient')
async def find_recent_patients():
    return patientsEntity(db.metaphase.patient.find().limit(5).sort('_id',-1))

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


@patient.put("/patient/{id}", status_code=status.HTTP_202_ACCEPTED)
def update_patient(id, patient: Patient):
    print(id)
    db.metaphase.patient.update_one({'_id': ObjectId(id)},{"$set":{'name': patient.name, 'address': patient.address, 'doctor_id': patient.doctor_id, 'age': patient.age, 'gender': patient.gender, 'analysed':patient.analysed}})
    return {'msg':f"Patient with id {id} updated."}