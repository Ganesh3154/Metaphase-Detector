from fastapi import APIRouter,status
from models.patient import Patient
from config.db import conn
from schemas.patient import patientEntity, patientsEntity
from bson.objectid import ObjectId
import cv2

patient = APIRouter()

@patient.get("/patient")
async def find_all_patients():
    '''List all patients'''
    return patientsEntity(conn.metaphase.patient.find())

@patient.get("/patient/{id}")
def get_patient(id):
    print(conn.metaphase.patient.find_one({"patient_id": int(id)}))
    '''Get patient details using their id'''
    return patientsEntity([conn.metaphase.patient.find_one({"patient_id": int(id)})])

@patient.get('/recent_patient')
async def find_recent_patients():
    return patientsEntity(conn.metaphase.patient.find().limit(5).sort('_id',-1))

@patient.post("/patient")
def register_patient(patient: Patient):
    '''Add new patients'''
    conn.metaphase.patient.insert_one(dict(patient))

@patient.put("/patient/{id}")
def update_patient(id, patient: Patient):
    '''Update patient details'''
    print(patient)
    conn.metaphase.patient.find_one_and_update({"patient_id": int(id)}, {"$set":{'name': patient.name, 'address': patient.address, 'doctor_id': int(patient.doctor_id), 'age': int(patient.age), 'gender': patient.gender, 'analysed':patient.analysed, 'patient_id': int(id)}})
    return patientsEntity(conn.metaphase.patient.find())

@patient.delete("/patient/{id}",status_code=status.HTTP_200_OK)
def delete_patient(id):
    '''Delete patient details using their id'''
    conn.metaphase.patient.find_one_and_delete({"patient_id": int(id)})
    return patientsEntity(conn.metaphase.patient.find())

@patient.get("/patient/{id}/analyse")
def analyse_patient_10x(id):
    '''Run ML algorithm to find metaphases from 10x images'''
    img_url = conn.metaphase.patient.find_one({'patient_id': int(id)}, {'url': 1})
    url = img_url['url']    
    print(url)
    # Read the image
    img = cv2.imread(url)
    # print(img)
    img = cv2.resize(img, (1000,1000))
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Apply threshold
    _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

    # Apply morphological operations
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
    cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    #cleaned = cv2.Canny(cleaned, 150, 50)
    cv2.imshow('clean', cleaned)

    # Find contours
    contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    min_area = 260  # minimum area for a metaphase chromosome
    max_area = 8000
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if area < min_area or area > max_area:
            continue

        # Check if the contour is roughly circular using the circularity metric
        perimeter = cv2.arcLength(cnt, True)
        circularity = 4 * 3.14 * area / (perimeter ** 2)
        if circularity < 0.75:
            cv2.drawContours(img, [cnt], 0, (0, 255, 0), 2)
        print(circularity)

        # Draw the contour on the original image
        
    # Draw contours on original image
    #cv2.drawContours(img, contours, -1, (0,255,0), 3)

    # Display the result
    cv2.imshow('Metaphase spread', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()
