# Full-Stack URL Shortener Web App

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Database Options](#database-options)
- [API Endpoints](#api-endpoints)
- [Usage Guide](#usage-guide)
- [Extending the Project](#extending-the-project)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Overview
This project is a full-stack URL shortener web application built with React (frontend) and Node.js/Express (backend). It supports user registration and login, URL shortening, analytics (click tracking), and QR code generation. The backend can use file-based, SQLite, or MySQL (XAMPP) storage for persistence.

## Features
- Shorten long URLs with optional custom shortcode and expiry
- Register and log in users (with persistent storage)
- Track analytics (number of clicks per short URL)
- Generate and display QR codes for each short URL
- Modern Material UI-inspired frontend
- Backend supports file, SQLite, or MySQL storage
- Easily extensible for more features (admin, preview, etc.)

## Project Structure
```
my-react-app/
  backend.js                # Main backend server
  users.json                # (If using file-based user storage)
  src/
    App.jsx                 # Main React app
    index.css               # Global styles
    FrontendTestSubmission/
      Frontend.jsx          # Main URL shortener UI
      Login.jsx             # Login form
      Register.jsx          # Registration form
      Analytics.jsx         # Analytics component
      QRCodeDisplay.jsx     # QR code display component
```

## Setup Instructions

### Backend Setup
1. **Install dependencies:**
   ```sh
   npm install express cors qrcode
   # For SQLite (optional):
   npm install sqlite3
   # For MySQL (optional):
   npm install mysql2
   ```
2. **Configure database:**
   - For file-based: No setup needed.

3. **Start the backend:**
   ```sh
   node backend.js
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup
1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start the frontend:**
   ```sh
   npm run dev
   # or
   npm start
   ```
   The frontend will run on `http://localhost:5173` (or similar).

## Database Options
- **File-based:** Users are stored in `users.json`.

## API Endpoints
### User
- `POST /api/user/register` — Register a new user
- `POST /api/user/login` — Log in a user

### URL Shortener
- `POST /api/shorten` — Shorten a URL
- `GET /:shortcode` — Redirect to the original URL

### Analytics & QR
- `GET /api/analytics/:shortcode` — Get click count
- `GET /api/qrcode/:shortcode` — Get QR code (base64 image)

## Usage Guide
1. **Register a new user** via the registration form.
2. **Log in** with your credentials.
3. **Shorten URLs** by entering the long URL, optional expiry, and shortcode.
4. **View analytics** and **QR code** for each short URL.
5. **Copy or share** the short URL or QR code as needed.

## Extending the Project
- Add user dashboards to manage URLs
- Add admin features (view all users/links)
- Add email verification or password reset
- Add preview/interstitial pages before redirect
- Add spam/malware detection for submitted URLs
- Add rate limiting and security features

## Troubleshooting
- **Backend not starting:** Check for port conflicts or missing dependencies.
- **Frontend not connecting:** Ensure backend is running and CORS is enabled.
- **Database errors:** Ensure your database (MySQL) is running and accessible.
- **Registration/Login issues:** Make sure you are using the same storage method in both backend and frontend.

## License
MIT License. Feel free to use and modify for your own projects.
