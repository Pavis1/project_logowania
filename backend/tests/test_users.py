from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_create_user():
    response = client.post("/api/users", json={
        "name": "Jan",
        "surname": "Kowalski",
        "email": "jan@test.com",
        "password": "1234",
        "role": "user"
    })

    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "jan@test.com"
    
    
def test_get_users():
    response = client.get("/api/users")

    assert response.status_code == 200
    assert isinstance(response.json(), list)
    
def test_delete_user():
 
    create = client.post("/api/users", json={
        "name": "Test",
        "surname": "User",
        "email": "delete@test.com",
        "password": "1234",
        "role": "user"
    })

    user_id = create.json()["id"]

    response = client.delete(f"/api/users/{user_id}")

    assert response.status_code == 200