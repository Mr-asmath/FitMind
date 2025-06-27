from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
import re
from typing import Optional, List

db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, index=True, nullable=False)
    password_hash = db.Column(db.String(200), nullable=False)

    # Personal details
    age = db.Column(db.Integer)
    gender = db.Column(db.String(10))
    height_cm = db.Column(db.Integer)
    weight_kg = db.Column(db.Float)  # Changed to Float for more precise weight tracking

    # Preference columns with docstrings explaining format
    fitness = db.Column(db.String(200), doc="Comma-separated list of fitness preferences")
    meditation = db.Column(db.String(200), doc="Comma-separated list of meditation preferences")
    yoga = db.Column(db.String(200), doc="Comma-separated list of yoga preferences")

    # Helpers and validations
    EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

    def __init__(self, **kwargs):
        super(User, self).__init__(**kwargs)
        self.validate()

    def validate(self):
        """Validate model data before saving"""
        if not self.EMAIL_REGEX.match(self.email):
            raise ValueError("Invalid email format")
        if len(self.full_name) < 2:
            raise ValueError("Full name must be at least 2 characters")
        if self.age is not None and (self.age < 1 or self.age > 120):
            raise ValueError("Age must be between 1 and 120")
        if self.height_cm is not None and (self.height_cm < 50 or self.height_cm > 250):
            raise ValueError("Height must be between 50cm and 250cm")
        if self.weight_kg is not None and (self.weight_kg < 2 or self.weight_kg > 500):
            raise ValueError("Weight must be between 2kg and 500kg")

    def set_password(self, raw: str):
        """Hash and store password"""
        if len(raw) < 8:
            raise ValueError("Password must be at least 8 characters")
        self.password_hash = bcrypt.generate_password_hash(raw).decode("utf-8")

    def verify(self, raw: str) -> bool:
        """Verify password against hash"""
        return bcrypt.check_password_hash(self.password_hash, raw)

    def get_preferences(self) -> dict:
        """Return preferences as dictionaries with lists"""
        return {
            'fitness': self.fitness.split(',') if self.fitness else [],
            'meditation': self.meditation.split(',') if self.meditation else [],
            'yoga': self.yoga.split(',') if self.yoga else [],
        }

    @classmethod
    def create(cls, *, full_name: str, email: str, password: str, **extra) -> 'User':
        """Create and save a new user with validation"""
        try:
            user = cls(full_name=full_name, email=email, **extra)
            user.set_password(password)
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise ValueError(f"User creation failed: {str(e)}")

    def update_preferences(self, fitness: Optional[List[str]] = None, 
                         meditation: Optional[List[str]] = None, 
                         yoga: Optional[List[str]] = None):
        """Update user preferences"""
        if fitness is not None:
            self.fitness = ','.join(fitness) if fitness else None
        if meditation is not None:
            self.meditation = ','.join(meditation) if meditation else None
        if yoga is not None:
            self.yoga = ','.join(yoga) if yoga else None
        db.session.commit()

    def __repr__(self):
        return f'<User {self.email}>'
    
    # Add this to your User model in models.py
def to_dict(self):
    return {
        "id": self.id,
        "full_name": self.full_name,
        "email": self.email,
        "age": self.age,
        "gender": self.gender,
        "height_cm": self.height_cm,
        "weight_kg": self.weight_kg,
        "fitness": self.fitness.split(",") if self.fitness else [],
        "meditation": self.meditation.split(",") if self.meditation else [],
        "yoga": self.yoga.split(",") if self.yoga else []
    }
