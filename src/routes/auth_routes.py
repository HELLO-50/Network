from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import random
import smtplib
from email.mime.text import MIMEText

auth_bp = Blueprint('auth', __name__)

def generate_university_id():
    """Generate a unique university ID"""
    return "EG" + str(random.randint(100000, 999999))

def send_email(to_email, university_id):
    """Send an email with the generated university ID"""
    sender_email = "your-email@example.com"
    sender_password = "your-email-password"
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    subject = "University ID Registration Confirmation"
    body = f"Dear student,\n\nYour registration was successful!\nYour University ID is: {university_id}\n\nBest Regards,\nUniversity Admin"

    msg = MIMEText(body)
    msg["From"] = sender_email
    msg["To"] = to_email
    msg["Subject"] = subject

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, msg.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    password = data.get('password')

    if not email or not first_name or not last_name or not password:
        return jsonify({"error": "All fields are required"}), 400

    # Check if email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error": "Email is already registered"}), 400

    # Generate unique university ID
    university_id = generate_university_id()

    # Hash password before saving
    hashed_password = generate_password_hash(password)

    # Create new user
    new_user = User(
        university_id=university_id,
        email=email,
        password=hashed_password,
        role="student",
        first_name=first_name,
        last_name=last_name
    )
    db.session.add(new_user)
    db.session.commit()

    # Send confirmation email
    send_email(email, university_id)

    return jsonify({"message": "Registration successful! Check your email for your University ID.", "university_id": university_id})

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    university_id = data.get('university_id')
    password = data.get('password')

    if not university_id or not password:
        return jsonify({"error": "Missing credentials"}), 400

    user = User.query.filter_by(university_id=university_id).first()

    if user and check_password_hash(user.password, password):
        return jsonify({"message": "Login successful!", "user": {"id": user.university_id, "name": user.first_name}})
    else:
        return jsonify({"error": "Invalid credentials"}), 401