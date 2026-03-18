# Smart Academy OS - Student Management System

A production-grade backend for managing students, courses, fees, and attendance.

## 🚀 Features

- **JWT Authentication**: Role-based access control (ADMIN, STUDENT).
- **MongoDB Transactions**: Atomic updates for registration, payments, and enrollment.
- **Advanced Search**: Cross-collection regex search for students (Name, Email, StudentId).
- **Core Modules**: Student profiles, Course management, Fees, Attendance, and Performance.
- **Dashboard**: Real-time analytics and aggregation-based reports.
- **Validation**: Request body validation using `Zod`.
- **Architecture**: Clean architecture with Controller-Service-Repository patterns.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Validation**: Zod
- **Real-time**: Socket.io
- **Cron Jobs**: Node-cron

## 📦 Installation

1. Clone the repository and navigate to the project directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in a `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sms_db
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```
4. Seed the database (optional):
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

## 🔌 API Endpoints (V1)

- **Auth**: `/api/v1/auth`
- **Students**: `/api/v1/students`
- **Courses**: `/api/v1/courses`
- **Fees**: `/api/v1/fees`
- **Attendance**: `/api/v1/attendance`
- **Tests**: `/api/v1/tests`
- **Dashboard**: `/api/v1/dashboard`

## 🧱 Folder Structure

```text
src/
├── controllers/     # Request handling
├── services/        # Business logic
├── repositories/    # Database operations
├── models/         # Mongoose schemas
├── routes/          # API routing
├── middlewares/     # Auth, validation, error handling
├── validators/      # Zod schemas
├── utils/           # Logistics & simple helpers
├── cron/            # Scheduled tasks
├── sockets/         # Real-time events
└── config/          # Configurations
```
