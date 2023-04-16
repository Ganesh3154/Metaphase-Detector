from fastapi import FastAPI
from routes.patient import patient
from routes.doctor import doctor

app = FastAPI()
app.include_router(patient)
app.include_router(doctor)