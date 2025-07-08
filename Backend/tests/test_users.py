import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

import pytest
from main import get_connection


# ───────────────────────────────────────────────────────────────
# GET /users
# ───────────────────────────────────────────────────────────────
def test_get_users_returns_list(test_client):
    response = test_client.get("/users")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


# ───────────────────────────────────────────────────────────────
# POST /users
# ───────────────────────────────────────────────────────────────
def test_create_user(test_client):
    email = "john.doe@example.com"

    # Nettoyage préalable
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = %s", (email,))
    conn.commit()
    cursor.close()
    conn.close()

    payload = {
        "firstname": "John",
        "lastname": "Doe",
        "email": email,
        "birthdate": "1990-01-01",
        "city": "Paris",
        "zipcode": "75001",
        "password": "secret123",
        "is_admin": False
    }

    response = test_client.post("/users", json=payload)
    assert response.status_code == 200
    assert response.json() == {"message": "Utilisateur créé avec succès"}


# ───────────────────────────────────────────────────────────────
# POST + GET vérification création
# ───────────────────────────────────────────────────────────────
def test_create_user_and_fetch_it(test_client):
    email = "testuser@example.com"

    # Suppression préalable
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = %s", (email,))
    conn.commit()
    cursor.close()
    conn.close()

    payload = {
        "firstname": "Test",
        "lastname": "User",
        "email": email,
        "birthdate": "1990-01-01",
        "city": "Paris",
        "zipcode": "75000",
        "password": "secret",
        "is_admin": False
    }

    post_response = test_client.post("/users", json=payload)
    assert post_response.status_code == 200

    get_response = test_client.get("/users")
    assert get_response.status_code == 200
    users = get_response.json()
    assert any(u["email"] == email for u in users)


# ───────────────────────────────────────────────────────────────
# POST /users - Conflit si email déjà utilisé
# ───────────────────────────────────────────────────────────────
def test_create_user_conflict_on_duplicate_email(test_client):
    email = "duplicate@example.com"

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = %s", (email,))
    conn.commit()
    cursor.close()
    conn.close()

    user_data = {
        "firstname": "Jean",
        "lastname": "Dupont",
        "email": email,
        "birthdate": "1992-04-12",
        "city": "Lyon",
        "zipcode": "69000",
        "password": "password",
        "is_admin": False
    }

    response1 = test_client.post("/users", json=user_data)
    assert response1.status_code == 200

    response2 = test_client.post("/users", json=user_data)
    assert response2.status_code == 409
    assert response2.json()["detail"] == "Email déjà utilisé"


# ───────────────────────────────────────────────────────────────
# DELETE /users/{id} par un admin
# ───────────────────────────────────────────────────────────────
def test_admin_can_delete_user(test_client):
    admin_email = "admin@example.com"
    user_email = "victim@example.com"

    # Clean emails
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email IN (%s, %s)", (admin_email, user_email))
    conn.commit()
    cursor.close()
    conn.close()

    # Création admin
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

    # Création user
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

    # Récupération ID
    users = test_client.get("/users").json()
    user_id = next(u["id"] for u in users if u["email"] == user_email)

    delete_response = test_client.delete(f"/users/{user_id}?admin_email={admin_email}")
    assert delete_response.status_code == 200
    assert "supprimé" in delete_response.json()["message"]


# ───────────────────────────────────────────────────────────────
# DELETE échoue avec un non-admin
# ───────────────────────────────────────────────────────────────
def test_non_admin_cannot_delete_user(test_client):
    non_admin_email = "nonadmin@example.com"

    # Clean
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE email = %s", (non_admin_email,))
    conn.commit()
    cursor.close()
    conn.close()

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

    response = test_client.delete("/users/999999?admin_email=nonadmin@example.com")
    assert response.status_code == 403
