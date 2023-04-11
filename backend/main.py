from fastapi import FastAPI, HTTPException
from typing import List
from models import User, Gender, Role, UpdateUser
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db: List[User] = [
    User(
        id = 1,
        first_name = "Brad",
        last_name = "Pitt",
        gender = Gender.male,
        roles = [Role.admin]
    ),
    User(
        id = 2,
        first_name = "Angelina",
        last_name = "Jolie",
        gender = Gender.female,
        roles = [Role.student, Role.user]
    )
]

@app.get("/")
def root():
    return {"New": "Project"}

@app.get("/users")
def fetch_users():
    return db

@app.post("/users/new")
def register_user(user: User):
    db.append(user)
    raise HTTPException(
        status_code=201,
        detail=f"User with id {user.id} registered."
    )

@app.delete("/users/delete/{user_id}")
def delete_user(user_id: int):
    for user in db:
        if user.id == user_id:
            db.remove(user)
            return f"User with id {user_id} deleted."
    raise HTTPException(
        status_code=404,
        detail=f"User with id {user_id} does not exist."
    )

@app.put("/users/{user_id}")
def update_user(user_id: int, user_update: UpdateUser):
    for user in db:
        if user.id == user_id:
            if user_update.first_name is not None:
                user.first_name = user_update.first_name
            if user_update.last_name is not None:
                user.last_name = user_update.last_name
            if user_update.middle_name is not None:
                user.middle_name = user_update.middle_name
            if user_update.gender is not None:
                user.gender = user_update.gender
            if user_update.roles is not None:
                user.roles = user_update.roles
            return user
    
    raise HTTPException(
        status_code=404,
        detail=f"User with id {user_id} does not exits."
    )

        
