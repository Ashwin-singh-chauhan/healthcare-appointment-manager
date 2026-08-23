# Build Roadmap

## Phase 1 — Foundation
- [x] React + Vite frontend
- [x] Spring Boot backend
- [x] PostgreSQL configuration
- [x] CORS
- [x] Health endpoint
- [x] Deployment-oriented environment variables

## Phase 2 — Database + Authentication
- [ ] users
- [ ] patient profile
- [ ] doctor profile
- [ ] admin role
- [ ] JWT login/register
- [ ] password hashing
- [ ] role-based endpoint protection

## Phase 3 — Appointment Engine
- [ ] doctor working hours
- [ ] slot generation
- [ ] appointment table
- [ ] unique booking constraint
- [ ] transaction/locking strategy
- [ ] temporary slot hold

## Phase 4 — Leave Management
- [ ] doctor leave table
- [ ] block future slots
- [ ] detect existing appointments
- [ ] cancellation/rescheduling flow
- [ ] affected-patient notification

## Phase 5 — LLM
- [ ] symptom submission
- [ ] structured pre-visit summary
- [ ] urgency level
- [ ] post-visit summary
- [ ] graceful fallback when LLM fails

## Phase 6 — Notifications
- [ ] booking email
- [ ] cancellation email
- [ ] reminder email
- [ ] retry mechanism
- [ ] medication reminder scheduler

## Phase 7 — Google Calendar
- [ ] OAuth 2.0
- [ ] create event
- [ ] update event
- [ ] delete event
- [ ] token storage/refresh

## Phase 8 — Frontend Portals
- [ ] patient portal
- [ ] doctor portal
- [ ] admin portal
- [ ] appointment management
- [ ] symptom/post-visit flows

## Phase 9 — Testing + Deployment
- [ ] unit tests
- [ ] integration tests
- [ ] concurrent booking test
- [ ] deployment
- [ ] production environment variables
- [ ] README/API docs
- [ ] system design write-up
