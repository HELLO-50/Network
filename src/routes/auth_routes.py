from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
import random
import smtplib
from email.mime.text import MIMEText

auth_bp = Blueprint('auth', __name__)

def generate_university_id():
    """Generate a unique University ID starting from EG000100 and incrementing"""
    last_user = User.query.order_by(User.university_id.desc()).first()
    
    if last_user and last_user.university_id.startswith("EG"):
        new_id = int(last_user.university_id[2:]) + 1  # Extract number and increment
    else:
        new_id = 100  # Start from EG000100 if no users exist

    while True:
        university_id = f"EG{new_id:06d}"  # Format as EG000100, EG000101, etc.
        existing_user = User.query.filter_by(university_id=university_id).first()
        
        if not existing_user:
            return university_id  # Return only if it's unique

        new_id += 1  # Try the next ID if the current one already exists

def send_email(to_email, university_id):
    """Send an email with the generated university ID"""
    sender_email = "educationgateway44@gmail.com" # add a gmail account
    sender_password = "imvdxbqmbzvlqjab" # add the gmail account password
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    subject = "Education Gateway Registration Confirmation"
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

    return jsonify({"message": "EG Registration successful! Check your email for your University ID.", "university_id": university_id})

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