def patientEntity(item) -> dict:
    return {
        'id': item['patient_id'],
        'name': item['name'],
        'address': item['address'],
        'doctor_id': item['doctor_id'],
        'age': item['age'],
        'gender': item['gender'],
        # 'url': item['url'],  
        'analysed': item['analysed']
    }

def patientsEntity(entity) -> list:
    return [patientEntity(item) for item in entity]