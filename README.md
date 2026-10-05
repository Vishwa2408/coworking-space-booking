# Coworking Space Booking System

A full-stack coworking space booking system where users can browse spaces, check availability, create bookings, and manage their bookings. Admins can manage spaces, maintenance windows, and approve or reject booking requests.

## Tech Stack

- React.js
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Joi Validation

## Setup

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

### 2. Create Admin

To create the admin user, run the following command from the `backend` directory:

```bash
npm run create-admin
```

Admin credentials are configured in the backend `.env` file.

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file inside the `backend` directory using `.env.example` as a reference.
Create a `.env` file inside the `frontend` directory using `.env.example` as a reference.

## Lint

Run the lint command from the respective project directory.

### Backend

```bash
cd backend
npm run lint
```

### Frontend

```bash
cd frontend
npm run lint
```
