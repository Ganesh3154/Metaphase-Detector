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

@doctor.get("/id")
def get_doctor(id):
    '''Get doctor details using their id'''
    return conn.metaphase.doctor.find_one({"_id": ObjectId(id)})

@doctor.post("/new_doctor")
def register_doctor(doctor: Doctor):
    '''Add new doctors'''
    conn.metaphase.doctor.insertOne(doctor)

@doctor.put("/id")
def update_doctor(id, doctor: Doctor):
    '''Update doctor details using their id'''
    conn.metaphase.doctor.find_one_and_update({"_id": ObjectId(id)}, {'$set': dict(doctor)})
    return doctorsEntity(conn.metaphase.doctor.find())

@doctor.delete("/id")
def delete_doctor(id, doctor: Doctor):
    '''Delete doctor details using their id'''
    conn.metaphase.doctor.find_one_and_delete({"_id": ObjectId(id)})
    return doctorsEntity(conn.metaphase.doctor.find())