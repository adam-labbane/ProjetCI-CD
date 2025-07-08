# Backend/tests/conftest.py
import pytest
from fastapi.testclient import TestClient
from main import app

@pytest.fixture(scope="module")
def test_client():
    return TestClient(app)
