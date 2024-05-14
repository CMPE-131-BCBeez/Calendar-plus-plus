def test_home(client):
    response = client.get("/login")
    assert b"<title> Login++ </title>" in response.data