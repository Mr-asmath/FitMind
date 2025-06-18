from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False, unique=True)
    password_hash = db.Column(db.String(128), nullable=False)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    height_cm = db.Column(db.Float)
    weight_kg = db.Column(db.Float)

    @classmethod
    def create(cls, **kwargs):
        pw_hash = bcrypt.generate_password_hash(kwargs.pop("password")).decode()
        user = cls(password_hash=pw_hash, **kwargs)
        db.session.add(user)
        db.session.commit()
        return user

    def verify(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
