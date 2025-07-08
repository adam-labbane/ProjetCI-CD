# Backend/tests/conftest.py
import sys
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
sys.path.append(str(BASE_DIR))

from fastapi.testclient import TestClient
from main import app

import pytest

@pytest.fixture(scope="module")
def test_client():
    return TestClient(app)
