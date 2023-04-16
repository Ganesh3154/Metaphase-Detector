from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"

class Patient(BaseModel):
    name: str
    address: str
    doctor_id: int
    age: int
    gender: Gender
    analysed: bool
    url: str
    patient_id: int