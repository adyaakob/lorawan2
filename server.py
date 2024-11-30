from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import jwt
import datetime
import json
import os

app = Flask(__name__, static_folder='.')
CORS(app)

# Simple credentials for testing
SECRET_KEY = 'your-secret-key'
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = 'admin123'

# Store content in a JSON file
CONTENT_FILE = 'content.json'

def load_content():
    if os.path.exists(CONTENT_FILE):
        with open(CONTENT_FILE, 'r') as f:
            return json.load(f)
    return {}

def save_content(content):
    with open(CONTENT_FILE, 'w') as f:
        json.dump(content, f, indent=2)

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/admin/<path:path>')
def serve_admin(path):
    return send_from_directory('admin', path)

@app.route('/admin/')
def serve_admin_index():
    return send_from_directory('admin', 'login.html')

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print("Received login request:", data)  # Debug print
        
        username = data.get('username')
        password = data.get('password')

        if username == ADMIN_USERNAME and password == ADMIN_PASSWORD:
            token = jwt.encode({
                'user': username,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, SECRET_KEY, algorithm='HS256')
            
            response = {'token': token}
            print("Login successful, sending response:", response)  # Debug print
            return jsonify(response)
        
        print("Invalid credentials")  # Debug print
        return jsonify({'message': 'Invalid credentials'}), 401
        
    except Exception as e:
        print("Login error:", str(e))  # Debug print
        return jsonify({'message': 'Server error occurred'}), 500

def verify_token():
    token = request.headers.get('Authorization')
    if not token or not token.startswith('Bearer '):
        return None
    
    token = token.split('Bearer ')[1]
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
    except:
        return None

@app.route('/api/content/<section_id>', methods=['GET'])
def get_content(section_id):
    auth = verify_token()
    if not auth:
        return jsonify({'message': 'Unauthorized'}), 401

    content = load_content()
    return jsonify({'content': content.get(section_id, '')})

@app.route('/api/content', methods=['POST'])
def update_content():
    auth = verify_token()
    if not auth:
        return jsonify({'message': 'Unauthorized'}), 401

    data = request.get_json()
    section = data.get('section')
    content = data.get('content')

    if not section or content is None:
        return jsonify({'message': 'Invalid request'}), 400

    all_content = load_content()
    all_content[section] = content
    save_content(all_content)

    return jsonify({'message': 'Content updated successfully'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
