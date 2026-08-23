# Healthcare Appointment & Follow-up Manager

Starter repository for the Healthcare Appointment & Follow-up Manager assignment.

## Deployment-first architecture

- Frontend: React + Vite → Vercel
- Backend: Spring Boot 3.4 + Java 21 → Render
- Database: PostgreSQL → Neon / Supabase / Render PostgreSQL
- Future integrations: OpenAI-compatible LLM, SendGrid/Mailgun, Google Calendar OAuth 2.0
- Authentication: JWT with roles: PATIENT, DOCTOR, ADMIN

## Current starter

This starter intentionally contains only the foundation:
- React frontend
- Spring Boot backend
- PostgreSQL configuration
- CORS configuration
- Health-check API
- Environment-variable based configuration
- Basic project structure for future modules

No real medical/booking logic is implemented yet.

## Run locally

### Backend

Requirements:
- Java 21
- Maven 3.9+
- PostgreSQL

Create a database named `healthcare_manager`, then configure:

`backend/src/main/resources/application.properties`

or environment variables:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `FRONTEND_URL`

Run:

```bash
cd backend
mvn spring-boot:run
```

Backend: http://localhost:8080

Health check:
http://localhost:8080/api/health

### Frontend

Requirements:
- Node.js 20+

```bash
cd frontend
npm install
npm run dev
```

Frontend: http://localhost:5173

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:8080
```

## Deployment plan

### Database
Use Neon or Supabase PostgreSQL. Keep credentials only in the hosting provider's environment variables.

### Backend
Deploy `backend/` to Render as a Docker service or Java web service.

Environment variables:

```env
DB_URL=jdbc:postgresql://...
DB_USERNAME=...
DB_PASSWORD=...
FRONTEND_URL=https://your-frontend.vercel.app
JWT_SECRET=replace-with-a-long-random-secret
```

### Frontend
Deploy `frontend/` to Vercel.

Environment variable:

```env
VITE_API_URL=https://your-backend.onrender.com
```

## Assignment modules to build next

1. Database schema + JPA entities
2. Patient/Doctor/Admin authentication
3. Doctor management
4. Working hours + slot generation
5. Safe booking + double-booking prevention
6. Doctor leave + conflict handling
7. Symptom form + LLM pre-visit summary
8. Doctor post-visit notes + patient-friendly summary
9. Email notifications + retries
10. Google Calendar OAuth + event lifecycle
11. Medication reminder background jobs
12. Frontend portals
13. Testing
14. Deployment
15. README + system design write-up

The original assignment requires a complete source-code ZIP, setup documentation, `.env.example`, API docs, DB schema, LLM prompts, Google Calendar setup, hosted URL, and an 800-word system-design write-up.
