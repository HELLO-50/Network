from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from flask_migrate import Migrate
from routes.auth_routes import auth_bp
from routes.course_routes import course_bp
from routes.student_routes import student_bp
from routes.admin_routes import admin_bp

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": ["*", "https://hello-50.github.io"]}})
app.config.from_object(Config)

CORS(app, resources={r"/*": {"origins": "*"}})  # 

db.init_app(app)
migrate = Migrate(app, db)

# Register API Routes
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(course_bp, url_prefix='/courses')
app.register_blueprint(student_bp, url_prefix='/students')
app.register_blueprint(admin_bp, url_prefix='/admin')

@app.route('/')
def home():
    return "Hello from Flask!"

if __name__ == '__main__':
    app.run()