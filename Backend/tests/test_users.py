import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from fastapi.testclient import TestClient
from main import app, get_connection  


client = TestClient(app)

def test_get_users_returns_list():
    response = client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_user():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = 'john.doe@example.com'")
    conn.commit()
    cursor.close()
    conn.close()

    payload = {
        "firstname": "John",
        "lastname": "Doe",
        "email": "john.doe@example.com",
        "birthdate": "1990-01-01",
        "city": "Paris",
        "zipcode": "75001",
        "password": "secret123",
        "is_admin": False
    }

    response = client.post("/users", json=payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Utilisateur créé avec succès"}

def test_create_user_and_fetch_it():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = 'testuser@example.com'")
    conn.commit()
    cursor.close()
    conn.close()

    test_user = {
        "firstname": "Test",
        "lastname": "User",
        "email": "testuser@example.com",
        "birthdate": "1990-01-01",
        "city": "Paris",
        "zipcode": "75000",
        "password": "secret",
        "is_admin": False
    }

    post_response = client.post("/users", json=test_user)
    assert post_response.status_code == 200
    assert post_response.json() == {"message": "Utilisateur créé avec succès"}

    get_response = client.get("/users")
    assert get_response.status_code == 200
    users = get_response.json()
    assert any(u["email"] == "testuser@example.com" for u in users)
