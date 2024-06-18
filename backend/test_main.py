from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_get_advice():
    request_data = {"input_text": "I need an outfit for a job interview."}
    response = client.post("/advice", json=request_data)
    assert response.status_code == 200
    assert "message" in response.json()
    assert len(response.json()["message"]) > 0


def test_get_image():
    request_data = {"input_text": "A stylish outfit for a job interview."}
    response = client.post("/illustration", json=request_data)
    assert response.status_code == 200
    assert "url" in response.json()
    assert response.json()["url"].startswith("https://")
