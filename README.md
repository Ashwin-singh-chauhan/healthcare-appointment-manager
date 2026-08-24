# 🏥 Healthcare Appointment & Follow-up Manager

A full-stack healthcare appointment management platform designed to simplify doctor discovery, appointment scheduling, patient management, follow-ups, and healthcare workflows.

The application follows a deployment-ready architecture with a **React + Vite frontend**, **Spring Boot backend**, **PostgreSQL database**, and **JWT-based authentication**.

## 🚀 Live Demo

### Frontend
https://healthcare-appointment-manager-gamma.vercel.app/login

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control
- Patient, Doctor, and Admin roles
- Secure login and registration
- Protected frontend routes
- Backend authorization using Spring Security

### 👨‍⚕️ Doctor Management
- Doctor profiles
- Doctor specialization
- Doctor availability
- Working hours management
- Appointment slot management

### 👤 Patient Management
- Patient registration and login
- Patient profile
- Appointment history
- Upcoming appointments
- Follow-up information

### 📅 Appointment Management
- Browse available doctors
- View available appointment slots
- Book appointments
- Appointment status management
- Appointment cancellation
- Prevention of double booking
- Doctor leave/conflict handling

### 📝 Healthcare Workflow
- Patient symptom information
- Pre-visit information
- Doctor consultation notes
- Post-visit summaries
- Patient-friendly follow-up information

### 🤖 AI/LLM Integration
The architecture supports integration with an OpenAI-compatible LLM for:

- Pre-visit symptom summarization
- Doctor-facing patient summaries
- Post-visit patient-friendly summaries

### 📧 Notifications
The system is designed to support:

- Appointment confirmation emails
- Cancellation notifications
- Reminder emails
- Retry handling for failed notifications

### 📆 Google Calendar Integration
Planned integration with Google Calendar OAuth 2.0 for:

- Creating calendar events
- Updating appointment events
- Cancelling events
- Synchronizing appointments with doctor/patient calendars

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │        User Browser      │
                    │   Patient / Doctor /     │
                    │          Admin           │
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │     React + Vite         │
                    │       Frontend           │
                    │         Vercel            │
                    └────────────┬─────────────┘
                                 │
                              REST API
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │      Spring Boot         │
                    │        Backend           │
                    │          Render           │
                    └────────────┬─────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
       │ PostgreSQL  │    │ JWT / Spring│    │ External     │
       │  Database   │    │  Security   │    │ Integrations │
       └─────────────┘    └─────────────┘    └──────┬───────┘
                                                     │
                                  ┌──────────────────┼─────────────────┐
                                  ▼                  ▼                 ▼
                              LLM / AI          Email Service     Google Calendar

```
## 🛠️ Tech Stack

### Frontend
- React
- Vite
- JavaScript
- React Router
- CSS
- REST API integration
- JWT authentication

### Backend
- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Security
- Spring Data JPA
- Hibernate
- Maven
- JWT

### Database
- PostgreSQL

### Deployment
- Vercel — Frontend
- Render — Backend
- PostgreSQL — Database

### Integrations
- OpenAI-compatible LLM API
- Email service
- Google Calendar OAuth 2.0

---

## 📂 Project Structure

```text
healthcare-appointment-manager/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   │
│   │   └── test/
│   │
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.js
│
├── docs/
│
├── Dockerfile
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

Make sure the following are installed:

- Java 21
- Maven 3.9+
- Node.js 20+
- npm
- PostgreSQL
- Git

## 🔧 Backend Setup

### Clone the repository:
```text
git clone https://github.com/Ashwin-singh-chauhan/healthcare-appointment-manager.git

cd healthcare-appointment-manager
```
### Create a PostgreSQL database:
```text
CREATE DATABASE healthcare_manager;
```
### Configure the backend environment variables:
```text
DB_URL=jdbc:postgresql://localhost:5432/healthcare_manager
DB_USERNAME=postgres
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_long_random_secret
```
### Navigate to the backend:
```text
cd backend
```
### Run the Spring Boot application:
```text
mvn spring-boot:run
```
### The backend will be available at:
```text
http://localhost:8080
```
### Health check:
```text
http://localhost:8080/api/health
```

## 🎨 Frontend Setup

### Navigate to the frontend:
```text
cd frontend
```
### Install dependencies:
```text
npm install
```
### Create a .env file:
```text
VITE_API_URL=http://localhost:8080
```
### Start the development server:
```text
npm run dev
```
### The frontend will be available at:
```text
http://localhost:5173
```

## 🔑 Environment Variables
### Backend

```text
DB_URL=
DB_USERNAME=
DB_PASSWORD=
FRONTEND_URL=
JWT_SECRET=
```

### Frontend
```text
VITE_API_URL=
Important
```

Never commit real credentials, API keys, JWT secrets, database passwords, or OAuth credentials to GitHub.

Use environment variables in development and configure them through the hosting provider in production.

## 🔒 Authentication Flow

The application uses JWT-based authentication.

```text
User
 │
 ▼
Login / Register
 │
 ▼
Spring Boot Authentication API
 │
 ▼
Validate Credentials
 │
 ▼
Generate JWT
 │
 ▼
Frontend stores authentication state
 │
 ▼
JWT sent with protected API requests
 │
 ▼
Spring Security validates JWT
 │
 ▼
Access granted based on user role
```

### Supported roles:

```text
PATIENT
DOCTOR
ADMIN
```

## 📅 Appointment Booking Flow

```text
Patient
   │
   ▼
Select Doctor
   │
   ▼
View Available Slots
   │
   ▼
Select Date & Time
   │
   ▼
Submit Booking Request
   │
   ▼
Backend Validates Slot
   │
   ├── Slot unavailable ──► Reject Booking
   │
   └── Slot available
            │
            ▼
       Create Appointment
            │
            ▼
      Update Slot Status
            │
            ▼
    Send Confirmation
```

The backend is responsible for validating appointment availability to prevent conflicting or duplicate bookings.

## 👨‍⚕️ Doctor Workflow

```text
Doctor Login
     │
     ▼
Doctor Dashboard
     │
     ├── Manage Profile
     ├── Manage Working Hours
     ├── Manage Availability
     ├── View Appointments
     ├── Manage Leave
     └── Add Consultation Notes
```

## 👤 Patient Workflow

```text
Patient Registration
        │
        ▼
Patient Login
        │
        ▼
Patient Dashboard
        │
        ├── Search Doctors
        ├── View Availability
        ├── Book Appointment
        ├── View Upcoming Appointments
        ├── Cancel Appointment
        └── View Follow-up Information
```

## 🛡️ Security

The application follows several security practices:

-JWT authentication
-Role-based authorization
-Protected API endpoints
-Password hashing
-Environment-based secrets
-CORS configuration
-Server-side validation
-Database-level persistence
-No credentials committed to source control

## 🧪 Testing

The project supports backend and frontend testing.

### Backend tests can be executed using:
```text
cd backend
mvn test
```
### Frontend build:
```text
cd frontend
npm run build
```
###🚀 Deployment
### Frontend — Vercel

The React/Vite frontend is deployed on Vercel.

### Production URL:
```text
https://healthcare-appointment-manager-gamma.vercel.app/login
```

### Configure:
```text
VITE_API_URL=https://your-backend-url
```

### Backend — Render

The Spring Boot backend can be deployed as a Java/Docker service on Render.

Configure:
```text
DB_URL=jdbc:postgresql://...
DB_USERNAME=...
DB_PASSWORD=...
FRONTEND_URL=https://healthcare-appointment-manager-gamma.vercel.app
JWT_SECRET=your_secure_random_secret
```

## 🗄️ Database

PostgreSQL is used as the primary relational database.

The database is responsible for storing application data such as:

-Users
-Patients
-Doctors
-Doctor availability
-Working hours
-Appointments
-Leave records
-Consultation notes
-Follow-up information

JPA/Hibernate is used for object-relational mapping.

## 🔮 Future Enhancements

Planned/extendable modules include:

- Advanced doctor search and filtering
- Working-hours based automatic slot generation
- Robust double-booking prevention
- Doctor leave conflict handling
- AI-powered pre-visit summaries
- AI-powered post-visit summaries
- Email notifications and retry queues
- Google Calendar synchronization
- Medication reminder background jobs
- Complete patient portal
- Complete doctor portal
- Admin dashboard
- Automated integration testing
- API documentation with Swagger/OpenAPI
- Production monitoring and logging

## 📌 API Design

The backend follows a RESTful API architecture.

Typical API categories include:
```text
/auth
/users
/patients
/doctors
/appointments
/slots
/leaves
/consultations
/notifications
```
Authentication-protected endpoints require a valid JWT token.

## 🌐 Deployment Architecture
```text
                         INTERNET
                             │
                             ▼
                ┌────────────────────────┐
                │        Vercel          │
                │    React + Vite App    │
                └────────────┬───────────┘
                             │
                         HTTPS / REST
                             │
                             ▼
                ┌────────────────────────┐
                │        Render          │
                │    Spring Boot API     │
                └────────────┬───────────┘
                             │
                             ▼
                ┌────────────────────────┐
                │      PostgreSQL        │
                │        Database        │
                └────────────────────────┘
```

## 🎯 Project Goals

The primary goals of the system are:

- Simplify healthcare appointment scheduling.
- Provide separate workflows for patients, doctors, and administrators.
- Prevent appointment conflicts and double booking.
- Secure sensitive healthcare-related application data.
- Provide a scalable backend architecture.
- Support AI-assisted healthcare workflows.
- Integrate appointment scheduling with external services.
- Provide a deployment-ready full-stack application.

## 👨‍💻 Author

### Ashwin Singh Chauhan

## GitHub:

https://github.com/Ashwin-singh-chauhan

## 📄 License

This project is developed for educational and software engineering purposes.

