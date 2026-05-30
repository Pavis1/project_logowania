def test_login():
   
    client.post("/api/users", json={
        "name": "Login",
        "surname": "Test",
        "email": "login@test.com",
        "password": "1234",
        "role": "user"
    })

    response = client.post("/api/login", json={
        "email": "login@test.com",
        "password": "1234"
    })

    assert response.status_code == 200
    data = response.json()

    assert "access_token" in data
    


def test_admin_delete_forbidden():
   

    response = client.delete("/api/users/1")

    assert response.status_code in [401, 403]