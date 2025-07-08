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


def test_create_user_conflict_on_duplicate_email(test_client):
    user_data = {
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": "duplicate@example.com",
        "birthdate": "1992-04-12",
        "city": "Lyon",
        "zipcode": "69000",
        "password": "password",
        "is_admin": False
    }

    # Première insertion
    response1 = test_client.post("/users", json=user_data)
    assert response1.status_code == 200

    # Deuxième insertion avec le même email
    response2 = test_client.post("/users", json=user_data)
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Email déjà utilisé"

def test_admin_can_delete_user(test_client):
    admin_email = "admin@example.com"
    user_email = "victim@example.com"

    # Créer un admin
    test_client.post("/users", json={
        "firstname": "Admin",
        "lastname": "One",
        "email": admin_email,
        "birthdate": "1980-01-01",
        "city": "Nice",
        "zipcode": "06000",
        "password": "adminpass",
        "is_admin": True
    })

    # Créer un utilisateur normal
    test_client.post("/users", json={
        "firstname": "User",
        "lastname": "Victim",
        "email": user_email,
        "birthdate": "1990-02-02",
        "city": "Toulouse",
        "zipcode": "31000",
        "password": "userpass",
        "is_admin": False
    })

    # Récupérer ID du user à supprimer
    users = test_client.get("/users").json()
    user_id = next(u["id"] for u in users if u["email"] == user_email)

    # Suppression
    delete_response = test_client.delete(f"/users/{user_id}?admin_email={admin_email}")
    assert delete_response.status_code == 200
    assert "supprimé" in delete_response.json()["message"]

def test_non_admin_cannot_delete_user(test_client):
    non_admin_email = "nonadmin@example.com"

    test_client.post("/users", json={
        "firstname": "Non",
        "lastname": "Admin",
        "email": non_admin_email,
        "birthdate": "1995-05-05",
        "city": "Paris",
        "zipcode": "75000",
        "password": "nopass",
        "is_admin": False
    })

    # Suppression d’un ID inexistant avec email non-admin
    response = test_client.delete("/users/999999?admin_email=nonadmin@example.com")
    assert response.status_code == 403
