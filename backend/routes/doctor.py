from fastapi import APIRouter
from models.doctor import Doctor
from config.db import conn
from schemas.doctor import doctorEntity, doctorsEntity
from fastapi import HTTPException
from bson.objectid import ObjectId

doctor = APIRouter()

@doctor.get("/doctor")
async def find_all_doctors():
    '''List all doctors'''
    return doctorsEntity(conn.metaphase.doctor.find())

@doctor.get("/doctor/{id}")
def get_doctor(id):
    '''Get doctor details using their id'''
    return conn.metaphase.doctor.find_one({"doctor_id": id})

@doctor.post("/doctor")
def register_doctor(doctor: Doctor):
    '''Add new doctors'''
    conn.metaphase.doctor.insert_one(dict(doctor))

@doctor.put("/doctor/{id}")
def update_doctor(id, doctor: Doctor):
    '''Update doctor details using their id'''
    conn.metaphase.doctor.find_one_and_update({"doctor_id": int(id)}, {'$set':{'name': doctor.name, 'hospital': doctor.hospital, 'department': doctor.department, 'age': int(doctor.age), 'gender': doctor.gender, 'doctor_id': int(id)}})
    return doctorsEntity(conn.metaphase.doctor.find())

@doctor.delete("/doctor/{id}")
def delete_doctor(id):
    '''Delete doctor details using their id'''
    conn.metaphase.doctor.find_one_and_delete({"doctor_id": int(id)})
    return doctorsEntity(conn.metaphase.doctor.find())