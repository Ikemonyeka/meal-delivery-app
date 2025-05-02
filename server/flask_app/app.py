from flask import Flask, render_template, request

app = Flask(__name__)

@app.route("/")
def home():
    return "Welcome to SwiftBite Admin Panel"

@app.route("/admin/login")
def admin_login():
    return "Admin Login Page"

if __name__ == "__main__":
    app.run(port=5000, debug=True)