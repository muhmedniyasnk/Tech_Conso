# TechConso — Intelligent Construction Management System

TechConso is a web-based construction management platform that integrates machine learning to improve planning accuracy, resource estimation, and project coordination across all stakeholders in a construction company.

## Abstract

Construction projects involve multiple stakeholders and complex execution stages, making effective coordination, resource planning, and progress monitoring a challenging task. TechConso addresses this by providing a structured, collaborative platform with role-based access, stage-wise project tracking, real-time communication, and ML-powered predictions for labour and material requirements.

---

## Tech Stack

| Layer      | Technology                             |
|------------|----------------------------------------|
| Frontend   | Angular 21                             |
| Backend    | Node.js, Express 5, MongoDB (Mongoose) |
| Real-time  | Socket.IO                              |
| ML Service | Python, Flask, scikit-learn            |
| Auth       | JWT + bcrypt                           |
| File Upload| Multer                                 |
| Charts     | Chart.js                               |

---

## System Roles

- **Admin (CEO)** — Oversees organizational operations, approvals, and strategic monitoring
- **Manager** — Coordinates project planning and resource allocation
- **Supervisor** — Manages stage-wise construction execution, progress updates, and resource usage
- **Client** — Initiates projects, reviews designs, tracks progress, and communicates with the team

---

## Features

- Role-based authentication and access control
- Project creation, approval, and lifecycle management
- Stage-wise construction tracking (Foundation → Structural → Plumbing → Electrical → Finishing → Handover)
- Real-time project chat using Socket.IO
- Bill management and client billing view
- Design upload and review
- ML-powered cost and resource prediction per construction stage
- Progress logging and history tracking
- File uploads for designs and documents

---

## Project Structure

```
Techconso/
├── backend/          # Node.js + Express REST API
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── server.js
├── frontend/         # Angular 21 SPA
│   └── src/
│       └── app/
│           ├── pages/      # Role-based page components
│           ├── services/   # API service layer
│           ├── guards/     # Auth route guards
│           └── layout/
└── ML/               # Python Flask ML microservice
    ├── app.py
    ├── train_model.py
    ├── generate_dataset.py
    └── model.pkl
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.8
- MongoDB (local or Atlas)
- Angular CLI (`npm install -g @angular/cli`)

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PORT=5000
```

```bash
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200`

### 3. ML Service

```bash
cd ML
pip install flask scikit-learn joblib
python app.py
```

ML service runs on `http://localhost:6000`

---

## ML Prediction

The ML microservice exposes a single endpoint:

**Request:**
```
POST http://localhost:6000/predict
Content-Type: application/json

{
  "labour": 10,
  "materials": 5000,
  "days": 30
}
```

**Response:**
```json
{
  "predictedCost": 125000.0
}
```

The model is trained on construction stage data and improves as supervisors log real resource usage over time.

---

## API Base URLs

| Service    | URL                         |
|------------|-----------------------------|
| Backend    | `http://localhost:5000/api`  |
| ML Service | `http://localhost:6000`      |
| Frontend   | `http://localhost:4200`      |

---

## Key API Endpoints

| Method | Endpoint                        | Description                  |
|--------|---------------------------------|------------------------------|
| POST   | `/api/auth/login`               | User login                   |
| POST   | `/api/auth/register`            | User registration            |
| GET    | `/api/projects`                 | Get all projects             |
| POST   | `/api/projects`                 | Create a new project         |
| GET    | `/api/stages`                   | Get construction stages      |
| POST   | `/api/progress`                 | Log stage progress           |
| GET    | `/api/resource`                 | Get resource usage           |
| POST   | `/api/prediction`               | Get ML prediction            |
| GET    | `/api/chat/:projectId`          | Get project chat messages    |

---

## Construction Stages

The system divides construction into standardized stages:

1. Foundation
2. Structural Work
3. Plumbing
4. Electrical Work
5. Finishing
6. Handover

Each stage tracks planned vs actual labour, materials, duration, and cost.

---

## License

This project was developed as an academic capstone project.
