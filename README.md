# OKK Code Student Management System

A comprehensive and modern Student Management System (SMS) built with a decoupled architecture for maximum scalability and performance.

## 🚀 Project Structure

The project is now organized into two main components:

- **[backend/](file:///c:/Users/DELL/OneDrive/Desktop/okk%20code%20student%20mangement/backend)**: Node.js/Express server handling data, authentication, and logic.
- **[frontend/](file:///c:/Users/DELL/OneDrive/Desktop/okk%20code%20student%20mangement/frontend)**: Next.js (App Router) web application with a premium, responsive UI.

## 🛠️ Tech Stack

### Backend
- **Node.js & Express**: Core server framework.
- **MongoDB & Mongoose**: Database and schema management.
- **Socket.io**: Real-time notifications and updates.
- **JWT**: Secure authentication.

### Frontend
- **Next.js 15**: Modern React framework with App Router.
- **Tailwind CSS**: Premium, utility-first styling.
- **Lucide React**: Professional icon set.
- **Framer Motion**: Smooth micro-animations.

## 🏁 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB running locally or a remote URI

### 1. Setup Backend
```bash
cd backend
npm install
# Configure your .env file
npm start
```

### 2. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📱 Features

- **Dashboard**: Real-time statistics and overview of academy performance.
- **Student Management**: Full CRUD operations for student registration and tracking.
- **Attendance**: Integrated attendance tracking system (coming soon).
- **Notice Board**: Centralized communication for students and staff.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop views.
## 🔌 API Endpoints (V1)

Detailed API documentation can be found in the [backend/README.md](file:///c:/Users/DELL/OneDrive/Desktop/okk%20code%20student%20mangement/backend/README.md).

- **Auth**: `/api/v1/auth`
- **Students**: `/api/v1/students`
- **Dashboard**: `/api/v1/dashboard`
- **Courses**: `/api/v1/courses`
- **Fees**: `/api/v1/fees`
- **Attendance**: `/api/v1/attendance`

## 🧱 Project Evolution

This project has evolved from a monolithic backend into a modern, decoupled full-stack application. The `backend` remains the source of truth for all data, while the `frontend` provides a high-performance, user-friendly interface.
