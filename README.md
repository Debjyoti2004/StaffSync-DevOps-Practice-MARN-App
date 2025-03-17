# StaffSync - MERN Application with Docker

This is a MERN (MongoDB, Express, React, Node.js) application that has been Dockerized to simplify deployment and management.

## 🛠️ Project Structure

STAFFSYNC/ │── backend/ # Node.js backend │ ├── db/ # Database connection │ ├── routes/ # API routes │ ├── server.js # Main server file │ ├── .env # Environment variables (to be created manually) │ ├── Dockerfile # Backend Docker setup │ ├── package.json # Backend dependencies │── frontend/ # React frontend │ ├── src/ # React components │ ├── public/ # Static files │ ├── package.json # Frontend dependencies │── docker-compose.yaml # Docker setup │── README.md # Documentation

🚀 Local Development Setup

1️⃣ Backend Setup
```sh
cd backend
npm install
npm run start
```
2️⃣ Frontend Setup
```sh
cd frontend
npm install
npm run dev
```
3️⃣ Create Environment File
In the backend/ folder, create a .env file manually or use the command:
```sh
touch backend/.env
```
Add the following variables inside the .env file:
```sh
MONGODB_URL=<your-mongodb-connection-string>
PORT=5050
```
If you change the PORT, update API_BASE_URL in the frontend/src/components/Record.jsx and RecordList.jsx.
## 🐳 Running with Docker

Start the Application:
```sh
docker-compose up
```
Stop the Application:
```sh
docker-compose down
```
## 🌍 Accessing the Application

Frontend: Open in browser → http://localhost:3000 
Backend API: Check with Postman → http://localhost:5050/api
