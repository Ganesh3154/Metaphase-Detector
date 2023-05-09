def doctorEntity(item) -> dict:
    return {
        'id': item['doctor_id'],
        'name': item['name'],
        'hospital': item['hospital'],
        'department': item['department'],
        'age': item['age'],
        'gender': item['gender']
    }

def doctorsEntity(entity) -> list:
    return [doctorEntity(item) for item in entity]