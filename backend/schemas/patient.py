def patientEntity(item) -> dict:
    return {
        'id': str(item['_id']),
        'name': item['name'],
        'address': item['address'],
        'doctor_id': item['doctor_id'],
        'age': item['age'],
        'gender': item['gender'],
        'url': item['url'],
        'patient_id': item['patient_id']
    }

def patientsEntity(entity) -> list:
    return [patientEntity(item) for item in entity]