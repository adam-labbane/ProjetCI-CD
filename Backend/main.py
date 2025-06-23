from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import mysql.connector
from mysql.connector import IntegrityError

class User(BaseModel):
    firstname: str
    lastname: str
    email: str
    birthdate: str
    city: str
    zipcode: str
    password: str
    is_admin: Optional[bool] = False

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def hello_world():
    return {"message": "Hello World"}

# Connexion à la base MySQL
def get_connection():
    return mysql.connector.connect(
        host="mysql-adam-labbane.alwaysdata.net",
        user="418946_adam",
        password="418946_mazdour",
        database="adam-labbane_mysql"
    )

@app.get("/users")
def read_users():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, firstname, lastname, email FROM users")
    result = cursor.fetchall()
    cursor.close()
    conn.close()
    return result

@app.post("/users")
def create_user(user: User):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO users (firstname, lastname, email, birthdate, city, zipcode, password, is_admin)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            user.firstname,
            user.lastname,
            user.email,
            user.birthdate,
            user.city,
            user.zipcode,
            user.password,
            user.is_admin
        ))
        conn.commit()
        return {"message": "Utilisateur créé avec succès"}
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
    finally:
        cursor.close()
        conn.close()

@app.delete("/users/{user_id}")
def delete_user(user_id: int, admin_email: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT is_admin FROM users WHERE email = %s", (admin_email,))
    admin = cursor.fetchone()

    if not admin or not admin["is_admin"]:
        raise HTTPException(status_code=403, detail="Accès interdit : droits insuffisants")

    cursor.execute("DELETE FROM users WHERE id = %s", (user_id,))
    conn.commit()
    cursor.close()
    conn.close()

    return {"message": f"Utilisateur {user_id} supprimé"}

@app.get("/users/{user_id}")
def get_user_detail(user_id: int, admin_email: str):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT is_admin FROM users WHERE email = %s", (admin_email,))
    admin = cursor.fetchone()

    if not admin or not admin["is_admin"]:
        raise HTTPException(status_code=403, detail="Accès interdit : droits insuffisants")

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")

    return user
