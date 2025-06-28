from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import uuid
from werkzeug.security import generate_password_hash, check_password_hash
import json
from exercise_recommender import ExerciseRecommender

app = Flask(__name__)

recommender = ExerciseRecommender()

# Proper CORS configuration (single configuration point)
CORS(app, resources={
    r"/api/*": {
        "origins": "http://localhost:5173",
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True,
        "max_age": 86400
    }
})

def get_db_connection():
    conn = sqlite3.connect('users.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            dob TEXT,
            age INTEGER,
            height REAL,
            weight REAL,
            phone TEXT,
            address TEXT,
            device_id TEXT UNIQUE NOT NULL,
            activity_type TEXT,
            fitness_focus TEXT,
            meditation_focus TEXT,
            yoga_type TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/api/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        if not data:
            return jsonify({'success': False, 'error': 'No data received'}), 400

        required_fields = ['username', 'email', 'password', 'dob', 'age', 'height', 'weight', 'phone', 'address']
        missing_fields = [field for field in required_fields if field not in data or not data[field]]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        device_id = str(uuid.uuid4())
        conn = get_db_connection()
        
        try:
            conn.execute('''
                INSERT INTO users (
                    username, email, password, dob, age, 
                    height, weight, phone, address, device_id
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                data['username'].strip(),
                data['email'].lower().strip(),
                generate_password_hash(data['password']),
                data['dob'],
                int(data['age']),
                float(data['height']),
                float(data['weight']),
                data['phone'].strip(),
                data['address'].strip(),
                device_id
            ))
            conn.commit()
            
            return jsonify({
                'success': True,
                'device_id': device_id,
                'message': 'Registration successful'
            }), 201
            
        except sqlite3.IntegrityError as e:
            error_msg = 'Email already exists' if 'email' in str(e) else 'Username already exists'
            return jsonify({
                'success': False,
                'error': error_msg
            }), 409
            
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': 'Invalid numeric value in age, height, or weight'
        }), 400
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Registration failed: {str(e)}'
        }), 500
        
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return _build_cors_preflight_response()
    
    try:
        data = request.get_json()
        if not data or not data.get('email') or not data.get('password'):
            return jsonify({
                'success': False,
                'error': 'Email and password are required'
            }), 400

        conn = get_db_connection()
        user = conn.execute(
            'SELECT * FROM users WHERE email = ?', 
            (data['email'].lower().strip(),)
        ).fetchone()
        
        if user and check_password_hash(user['password'], data['password']):
            return jsonify({
                'success': True,
                'device_id': user['device_id'],
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'activity_type': user['activity_type']
                }
            }), 200
            
        return jsonify({
            'success': False,
            'error': 'Invalid email or password'
        }), 401
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Login failed: {str(e)}'
        }), 500
        
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/api/user/preferences', methods=['GET'])
def get_preferences():
    device_id = request.args.get('device_id')
    if not device_id:
        return jsonify({'error': 'Device ID required'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT activity_type, fitness_focus, meditation_focus, yoga_type FROM users WHERE device_id = ?',
        (device_id,)
    ).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({
        'activity_type': user['activity_type'],
        'fitness_focus': user['fitness_focus'],
        'meditation_focus': user['meditation_focus'],
        'yoga_type': user['yoga_type']
    })

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})

def _build_cors_preflight_response():
    response = jsonify({"status": "preflight"})
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:5173")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
    return response


@app.route('/api/user/recommendations', methods=['GET'])
def get_recommendations():
    device_id = request.args.get('device_id')
    if not device_id:
        return jsonify({'error': 'Device ID required'}), 400
    
    conn = get_db_connection()
    user = conn.execute(
        'SELECT activity_type, fitness_focus, meditation_focus, yoga_type FROM users WHERE device_id = ?',
        (device_id,)
    ).fetchone()
    conn.close()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    activity_type = user['activity_type']
    
    # Get focus areas based on activity type
    if activity_type == 'fitness':
        focus_areas = json.loads(user['fitness_focus'] or '[]')
    elif activity_type == 'meditation':
        focus_areas = json.loads(user['meditation_focus'] or '[]')
    elif activity_type == 'yoga':
        focus_areas = json.loads(user['yoga_type'] or '[]')
    else:
        return jsonify({'error': 'Invalid activity type'}), 400
    
    if not focus_areas:
        return jsonify({'error': 'No focus areas selected'}), 400
    
    # Get recommendations for each focus area
    recommendations = {}
    for focus in focus_areas[:3]:  # Limit to first 3 focus areas
        exercises = recommender.recommend_exercises(activity_type, focus)
        recommendations[focus] = exercises
    
    return jsonify({
        'activity_type': activity_type,
        'recommendations': recommendations
    })

@app.route('/api/user/update-preferences', methods=['POST'])
def update_preferences():
    data = request.get_json()
    if not data or not data.get('device_id') or not data.get('activity_type') or not data.get('selections'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    valid_activities = ['fitness', 'meditation', 'yoga']
    if data['activity_type'] not in valid_activities:
        return jsonify({'error': 'Invalid activity type'}), 400
    
    field_map = {
        'fitness': 'fitness_focus',
        'meditation': 'meditation_focus',
        'yoga': 'yoga_type'
    }
    update_field = field_map[data['activity_type']]
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            f"UPDATE users SET activity_type = ?, {update_field} = ? WHERE device_id = ?",
            (data['activity_type'], json.dumps(data['selections']), data['device_id'])
        )
        
        if cursor.rowcount == 0:
            return jsonify({'error': 'User not found'}), 404
        
        conn.commit()
        
        # Get updated recommendations
        recommendations = {}
        for focus in data['selections'][:3]:  # Limit to first 3 focus areas
            exercises = recommender.recommend_exercises(data['activity_type'], focus)
            recommendations[focus] = exercises
        
        return jsonify({
            'success': True,
            'message': 'Preferences updated successfully',
            'recommendations': recommendations
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/fitness', methods=['GET'])
def fitness():
    return jsonify({'available': True})

@app.route('/meditation', methods=['GET'])
def meditation():
    return jsonify({'available': True})

@app.route('/yoga', methods=['GET'])
def yoga():
    return jsonify({'available': True})


@app.route('/api/user/update_completed', methods=['POST'])
def update_completed():
    data = request.get_json()
    device_id = data.get('device_id')
    completed_value = data.get('completed')

    if not device_id or not completed_value:
        return jsonify({'error': 'Missing device_id or completed'}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE device_id = ?", (device_id,))
    user = cursor.fetchone()

    if not user:
        conn.close()
        return jsonify({'error': 'User not found'}), 404

    cursor.execute("UPDATE users SET completed = ? WHERE device_id = ?", (completed_value, device_id))
    conn.commit()
    conn.close()

    return jsonify({'message': 'Completed status updated successfully'}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
