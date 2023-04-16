def doctorEntity(item) -> dict:
    return {
        'id': str(item['_id']),
        'name': item['name'],
        'hospital': item['hospital'],
        'age': item['age'],
        'gender': item['gender']
    }

def doctorsEntity(entity) -> list:
    return [doctorEntity(item) for item in entity]