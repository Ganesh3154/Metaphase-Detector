from pydantic import BaseModel
from enum import Enum

class Gender(str, Enum):
    male = "male"
    female = "female"

class Doctor(BaseModel):
    name: str
    hospital: str
    age: int
    gender: Gender