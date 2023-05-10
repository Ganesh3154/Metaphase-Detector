from typing import List
from fastapi import APIRouter,status,File,UploadFile
from models.patient import Patient
from config.db import conn
from schemas.patient import patientsEntity
from fastapi.responses import FileResponse
import cv2
import numpy as np 
import math
import os
import uuid
from tensorflow import keras
from PIL import Image
import matplotlib.pyplot as plt

patient = APIRouter()

@patient.get("/patient")
async def find_all_patients():
    '''List all patients'''
    return patientsEntity(conn.metaphase.patient.find({},{'url': 0}))

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

@patient.get("/patient/images/detect/{id}")
async def get_images(id):
    # img_path = 'images/0/1.png'
    # print(img_path)
    print(id)
    images = os.listdir(os.path.join('images/detect/'+str(id)))
    # print(images)
    return [FileResponse(src) for src in images]

@patient.post("/patient/{id}/detect_metaphase")
async def detect_metaphase(id, file: List[UploadFile] = File(...)):
    '''Run ML algorithm to find metaphases from 10x images'''
    if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
        return {'msg': f'Patient with id {id} not found'}

    for files in file:
    # Read the image
        contents = await files.read()
        nparr = np.fromstring(contents, np.uint8)
        nparr1 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.resize(nparr1, (1000, 1000))

        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

        # Apply threshold
        _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV|cv2.THRESH_OTSU)

        # Apply morphological operations
        kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
        kernel1 = cv2.getStructuringElement(cv2.MORPH_RECT, (6, 3))
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)

        # applying erosion
        kernel = np.ones((5, 5), np.uint8)
        erosion = cv2.erode(cleaned, kernel, iterations=2)

        # Find contours
        contours, _ = cv2.findContours(erosion, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        min_area = 30  # minimum area for a metaphase chromosome
        max_area = 8000
        for cnt in contours:
            M = cv2.moments(cnt)
            area = cv2.contourArea(cnt)
            radius = int(math.sqrt(area / 3.14)) + 1    # finding the radius of the circle using the area of the circle
        #     print(int(radius))
            if area < min_area or area > max_area:
                continue
            
            # Check if the contour is roughly circular using the circularity metric
            perimeter = cv2.arcLength(cnt, True)
            circularity = 4 * 3.14 * area / (perimeter ** 2)
            if circularity > 0.31:
                # cv2.drawContours(img, [cnt], 0, (0, 255, 0), 2)
                if M['m00']:
                    cx = int(M['m10']/M['m00'])
                    cy = int(M['m01']/M['m00'])
                    cv2.circle(cleaned, (cx, cy), radius + 10, (0, 0, 0), -1)
                    # cv2.circle(img, (cx, cy), 2, (0, 0, 255), -1)
                
        # Applying dilation
        kernel = np.ones((5,5),np.uint8)
        dilated = cv2.dilate(cleaned,kernel,iterations = 6)

        contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        min_area = 3000  # minimum area for a metaphase chromosome
        max_area = 50000
        for cnt in contours:
            M = cv2.moments(cnt)
            area = cv2.contourArea(cnt)
            radius = int(math.sqrt(area / 3.14)) + 1
            print(int(radius))
            if area < min_area or area > max_area:
                continue
            
            # Check if the contour is roughly circular using the circularity metric
            perimeter = cv2.arcLength(cnt, True)
            circularity = 4 * 3.14 * area / (perimeter ** 2)
        #     if circularity < 0.5:
        #         cv2.drawContours(img1, [cnt], 0, (0, 255, 0), 2)
            if M['m00']:
        #         print(M)
                cx = int(M['m10']/M['m00'])
                cy = int(M['m01']/M['m00'])
                cv2.circle(img, (cx, cy), radius, (0, 0, 255), 5)

        # cv2.imshow('eroded', erosion)
        # cv2.imshow('final', img)
        # path = 'images/detect/{id}'+'.png'
        if not os.path.exists('images/detect/'+str(id)):
            os.mkdir(os.path.join('images/detect/'+str(id)))
        img_path = os.path.join('images/detect/'+str(id)+'/'+str(uuid.uuid4())+'.png')
        cv2.imwrite(img_path, img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()

# @patient.get("/patient/images/analyse/{id}")
# async def get_images(id):
#     # img_path = 'images/0/1.png'
#     # print(img_path)
#     print(id)
#     images = os.listdir(os.path.join('images/detect/'+str(id)))
#     # print(images)
#     return [FileResponse(src) for src in images]

@patient.post("/patient/analyse/{id}")
async def analysable_unanalysable(id, file: UploadFile = File(...)):
    # if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
    #     return {'msg': f'Patient with id {id} not found'}

    # for files in file:
    # Read the image
    contents = await file.read()
    nparr = np.fromstring(contents, np.uint8)
    nparr1 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img1 = nparr1

    # neural network
    model_path = os.path.join('NN_model/new_model2.h5')
    model = keras.models.load_model(model_path)
    # img1 = cv2.imread('model_dataset/test/an/sl112_0028.tif')
    font = cv2.FONT_HERSHEY_PLAIN
    img = Image.fromarray(img1, 'RGB')
    img = img.resize((150,150))
    # print(img)
    img = np.expand_dims(img, axis=0)
    img1 = cv2.resize(img1, (400,400))
    print(model.predict(img))
    print("Predicted value:", int(model.predict(img)[0,0]))
    if not int(model.predict(img)[0,0]):
        cv2.putText(img1, 'Analysable', (10,40), fontFace= font, fontScale=3, color=(0,255,0), thickness=3)
    #     cv2.imshow('img', img1)
        # plt.imshow(img1)
        print('Analysable')
        if not os.path.exists('images/analyse/'+str(id)):
            os.mkdir(os.path.join('images/analyse/'+str(id)))
        img_path = os.path.join('images/analyse/'+str(id)+'/'+str(uuid.uuid4())+'.png')
        print(img_path)
        cv2.imwrite(img_path, img1)
    else:
        cv2.putText(img1, 'Unanalysable', (10,40), fontFace= font, fontScale=3, color=(0,255,0), thickness=3)
    #     print(img1)
    #     cv2.imshow('img', img1)
        # plt.imshow(img1)
        print('Unanalysable')
        cv2.waitKey()

    if not os.path.exists('images/detect/'+str(id)):
        os.mkdir(os.path.join('images/detect/'+str(id)))
    img_path = os.path.join('images/detect/'+str(id)+'/'+str(uuid.uuid4())+'.png')
    cv2.imwrite(img_path, img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

patient.AREA = []
@patient.post("/patient/{id}/rank")
async def rank(id, file: List[UploadFile] = File(...)):
    if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
        return {'msg': f'Patient with id {id} not found'}
