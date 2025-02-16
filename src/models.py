from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    university_id = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    role = db.Column(db.Enum('student', 'instructor', 'admin'), default='student')
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Course(db.Model):
    course_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    created_by = db.Column(db.String(20), db.ForeignKey('user.university_id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Enrollment(db.Model):
    enrollment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    university_id = db.Column(db.String(20), db.ForeignKey('user.university_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)

class Progress(db.Model):
    progress_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    university_id = db.Column(db.String(20), db.ForeignKey('user.university_id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.course_id'), nullable=False)
    module_completed = db.Column(db.String(255), nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow)

class LMSSetting(db.Model):
    setting_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    setting_key = db.Column(db.String(255), unique=True, nullable=False)
    setting_value = db.Column(db.Text, nullable=False)