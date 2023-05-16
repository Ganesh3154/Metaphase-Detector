from typing import List
from fastapi import APIRouter, HTTPException,status,File,UploadFile
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
from collections import OrderedDict

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
    

@patient.post("/patient/detect_metaphase/{id}")
async def detect_metaphase(id, file: List[UploadFile] = File(...)):
    '''Run ML algorithm to find metaphases from 10x images'''
    if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
        raise HTTPException(status_code=404, detail=f'Patient with id {id} not found')


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

@patient.get("/patient/images/analyse/{id}")
async def get_images(id):
    # img_path = 'images/0/1.png'
    # print(img_path)
    print(id)
    images = os.listdir(os.path.join('images/analyse/'+str(id)))
    # print(images)
    return [FileResponse(src) for src in images]


@patient.post("/patient/analyse/{id}")
async def analysable_unanalysable(id, file: List[UploadFile] = File(...)):
    if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
        raise HTTPException(status_code=404, detail=f'Patient with id {id} not found')

    if conn.metaphase.patient.find_one({"patient_id": int(id)})['analysed']:
        raise HTTPException(status_code=400, detail='already analysed')

    patient.AREA = []

    for files in file:
    # Read the image
        contents = await files.read()
        nparr = np.fromstring(contents, np.uint8)
        nparr1 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img1 = nparr1

        # neural network
        model_path = os.path.join('NN_model/new_model2.h5')
        model = keras.models.load_model(model_path)
        # img1 = cv2.imread('model_dataset/test/an/sl112_0028.tif')
        font = cv2.FONT_HERSHEY_PLAIN
        img = Image.fromarray(img1, 'RGB')
        img = img.resize((150, 150))
        # print(img)
        img = np.expand_dims(img, axis=0)
        img1 = cv2.resize(img1, (400,400))
        print(model.predict(img))
        print("Predicted value:", int(model.predict(img)[0,0]))
        if not int(model.predict(img)[0,0]):
            new_img = cv2.resize(nparr1, (1000, 1000))
            # Convert to grayscale
            gray = cv2.cvtColor(new_img, cv2.COLOR_BGR2GRAY)

            # Apply threshold
            _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

            # Apply morphological operations
            kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
            cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
            # cv2.imshow('clean', cleaned)


            kernel = np.ones((5, 5), np.uint8)
            erosion = cv2.erode(cleaned, kernel, iterations=5)
            # cv2.imshow('erosion', erosion)
            # Find contours
            contours, _ = cv2.findContours(erosion, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            min_area = 1000 # minimum area for a nucleus
            max_area = 1100000
            for cnt in contours:
                M = cv2.moments(cnt)
                area = cv2.contourArea(cnt)
            #   area = cv2.contourArea(cnt)
                radius = int(math.sqrt(area / 3.14)) + 1
                if area < min_area or area > max_area:
            #        cv2.circle(cleaned, (cx, cy), radius + 10, (0, 0, 0), -1)
                    continue

                # Check if the contour is roughly circular using the circularity metric
                perimeter = cv2.arcLength(cnt, True)
                circularity = 4 * 3.14 * area / (perimeter ** 2)
                if circularity > 0.31:
            #        cv2.drawContours(img, [cnt], 0, (0, 0, 255), 2)
                    if M['m00']:
                        cx = int(M['m10']/M['m00'])
                        cy = int(M['m01']/M['m00'])
                        cv2.circle(cleaned, (cx, cy), radius + 50, (0, 0, 0), -1)
            #            cv2.circle(img, (cx, cy), 2, (0, 0, 255), -1)


            # kernel = np.ones((5, 5), np.uint8)
            # erosion = cv2.erode(cleaned, kernel, iterations=2)
            # cv2.imshow('erosion', erosion)
            contours, _ = cv2.findContours(erosion, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            min_area = 500  # minimum area for a metaphase chromosome
            max_area = 8000
            for cnt in contours:
                M = cv2.moments(cnt)
                area = cv2.contourArea(cnt)
            #   area = cv2.contourArea(cnt)
                radius = int(math.sqrt(area / 3.14)) + 1
                if area < min_area or area > max_area:
            #        cv2.circle(cleaned, (cx, cy), radius + 10, (0, 0, 0), -1)
                    continue

                # Check if the contour is roughly circular using the circularity metric
                perimeter = cv2.arcLength(cnt, True)
                circularity = 4 * 3.14 * area / (perimeter ** 2)
                if circularity < 0.74:
            #        cv2.drawContours(img, [cnt], 0, (0, 0, 255), 2)
                    if M['m00']:
                        cx = int(M['m10']/M['m00'])
                        cy = int(M['m01']/M['m00'])
                        cv2.circle(cleaned, (cx, cy), radius + 50, (0, 0, 0), -1)
                        cv2.circle(new_img, (cx, cy), 2, (0, 0, 255), -1)


            kernel = np.ones((5,5),np.uint8)
            dilated = cv2.dilate(cleaned,kernel,iterations = 10)
            # cv2.imshow('dilated', dilated)

            contours, _ = cv2.findContours(dilated, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            min_area = 20000 # minimum area for a nucleus
            max_area = 1100000
            for cnt in contours:
                M = cv2.moments(cnt)
                area = cv2.contourArea(cnt)
            #   area = cv2.contourArea(cnt)
                radius = int(math.sqrt(area / 3.14)) + 1
                if area < min_area or area > max_area:
            #        cv2.circle(cleaned, (cx, cy), radius + 10, (0, 0, 0), -1)
                    continue

                
                # Check if the contour is roughly circular using the circularity metric
                perimeter = cv2.arcLength(cnt, True)
                circularity = 4 * 3.14 * area / (perimeter ** 2)
            #    if circularity < 0.74:
            #        cv2.drawContours(img, [cnt], 0, (0, 0, 255), 2)
                if M['m00']:
                    cx = int(M['m10']/M['m00'])
                    cy = int(M['m01']/M['m00'])
            #            cv2.circle(cleaned, (cx, cy), radius + 50, (0, 0, 0), -1)
            #        cv2.circle(img, (cx, cy), 2, (0, 0, 255), -1)
            #        cv2.circle(img, (cx, cy), radius+10, (0, 0, 255), 5)

            met_radius = radius + 10
            total_area = 3.14 * pow(met_radius, 2)
            patient.AREA.append((new_img, total_area))

            # Display the result
            # cv2.imshow('Metaphase spread', img)

            # cv2.putText(img1, 'Analysable', (10,40), fontFace= font, fontScale=3, color=(0,255,0), thickness=3)
            #cv2.imshow('img', img1)
            # plt.imshow(img1)
            print('Analysable')
            # if not os.path.exists('images/analyse/'+str(id)):
            #     os.mkdir(os.path.join('images/analyse/'+str(id)))
            # img_path = os.path.join('images/analyse/'+str(id)+'/'+str(uuid.uuid4())+'.png')
            # print(img_path)
            # cv2.imwrite(img_path, img1)
        else:
            cv2.putText(img1, 'Unanalysable', (10,40), fontFace= font, fontScale=3, color=(0,255,0), thickness=3)
            #print(img1)
            #cv2.imshow('img', img1)
            # plt.imshow(img1)
            print('Unanalysable')
            cv2.waitKey()

    # sorting the values in patient.AREA
    first = 1   
    last = len(patient.AREA)   
    for k in range(0, last):   
        for l in range(0, last-k-1):   
            if (patient.AREA[l][first] < patient.AREA[l + 1][first]):   
                new_item = patient.AREA[l]   
                patient.AREA[l]= patient.AREA[l + 1]
                patient.AREA[l + 1]= new_item   
    # print(patient.AREA)

    # if last >= 20:
    #     last = 20
    try:
        for i in range(20):  
            if not os.path.exists('images/analyse/'+str(id)):
                os.mkdir(os.path.join('images/analyse/'+str(id)))
            img_path = os.path.join('images/analyse/'+str(id)+'/'+str(uuid.uuid4())+'.png')
            ranked_image = patient.AREA[i][0]
            cv2.imwrite(img_path, ranked_image)
            print(ranked_image)
    except IndexError:
        pass

    conn.metaphase.patient.find_one_and_update({"patient_id": int(id)}, {"$set":{'analysed': True}})
    
                    # print(img_path)
        # print(sorted[0])
        # if not os.path.exists('images/detect/'+str(id)):
        #     os.mkdir(os.path.join('images/detect/'+str(id)))
        # img_path = os.path.join('images/detect/'+str(id)+'/'+str(uuid.uuid4())+'.png')
        # cv2.imwrite(img_path, img)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()
    

# patient.AREA = {}
# @patient.post("/patient/{id}/rank")
# async def rank(id, file: List[UploadFile] = File(...)):
#     if not conn.metaphase.patient.find_one({"patient_id": int(id)}):
#         return {'msg': f'Patient with id {id} not found'}
    
#     for files in file:
#     # Read the image
#         contents = await files.read()
#         nparr = np.fromstring(contents, np.uint8)
#         nparr1 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
#         img = cv2.resize(nparr1, (1000, 1000))
#         # Convert to grayscale
#         gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

#         total_area = 0

#         # Apply threshold
#         _, thresh = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY_INV+cv2.THRESH_OTSU)

#         # Apply morphological operations
#         kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,5))
#         cleaned = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
#         # cv2.imshow('clean', cleaned)

#         # Find contours
#         contours, _ = cv2.findContours(cleaned, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

#         min_area = 260  # minimum area for a metaphase chromosome
#         max_area = 8000
#         for cnt in contours:
#             area = cv2.contourArea(cnt)
#         #   area = cv2.contourArea(cnt)
#             if area < min_area or area > max_area:
#                 continue

#             # Check if the contour is roughly circular using the circularity metric
#             perimeter = cv2.arcLength(cnt, True)
#             circularity = 4 * 3.14 * area / (perimeter ** 2)
#             if circularity < 0.74:
#                 cv2.drawContours(img, [cnt], 0, (0, 0, 255), 2)
#                 total_area += area
#         #     print(circularity)
#             # Draw the contour on the original image
            
#         # Draw contours on original image
#         #cv2.drawContours(img, contours, -1, (0,255,0), 3)

#         # Display the result
#         print(total_area)
#         patient.AREA[files.filename] = total_area
#         # cv2.imshow('Metaphase spread', img)
#         cv2.waitKey(0)
#         cv2.destroyAllWindows()
#     print(patient.AREA)

#     # sorting the values in patient.AREA
#     keys = list(patient.AREA.keys())
#     values = list(patient.AREA.values())
#     sorted_value_index = np.argsort(values)
#     patient.AREA = {keys[i]: values[i] for i in sorted_value_index}
    
#     print(patient.AREA)