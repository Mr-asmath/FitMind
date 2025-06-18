import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from models import db, bcrypt, User
from dotenv import load_dotenv

load_dotenv()                      # reads .env for secrets

def create_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///companion.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-key")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET", "jwt-dev-key")

    db.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)
    CORS(app, supports_credentials=True)

    @app.post("/api/register")
    def register():
        data = request.json
        try:
            User.create(
                full_name=data["full_name"],
                email=data["email"],
                password=data["password"],
                age=data.get("age"),
                gender=data.get("gender"),
                height_cm=data.get("height_cm"),
                weight_kg=data.get("weight_kg"),
            )
            return jsonify({"msg": "Registration successful"}), 201
        except Exception as e:
            return jsonify({"error": str(e)}), 400

    @app.post("/api/login")
    def login():
        data = request.json
        user = User.query.filter_by(email=data["email"]).first()
        if user and user.verify(data["password"]):
            token = create_access_token(identity=user.id)
            return jsonify(access_token=token), 200
        return jsonify({"error": "Invalid credentials"}), 401

    @app.get("/api/me")
    @jwt_required()
    def me():
        uid = get_jwt_identity()
        user = User.query.get(uid)
        return jsonify(full_name=user.full_name, email=user.email)

    return app

if __name__ == "__main__":
    app = create_app()
    with app.app_context():
        db.create_all()
    app.run(debug=True)
