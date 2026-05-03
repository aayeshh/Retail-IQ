import os
import sys
sys.path.insert(0, os.getcwd())
from app import app
client = app.test_client()
import json

paths = [
    ('/api/announcements/all', 'GET', None),
]

for path, method, body in paths:
    if method == 'GET':
        resp = client.get(path)
    else:
        resp = client.post(path, json=body)
    print(path, resp.status_code, json.dumps(resp.get_json(), default=str))
