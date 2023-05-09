from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = "Male"
    female = "Female"

class Doctor(BaseModel):
    doctor_id: int
    name: str
    hospital: str
    department: str
    age: int
    gender: Gender