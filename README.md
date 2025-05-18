# Disperso

This project implements a basic application using the **MERN stack** (MongoDB, Express.js, React.js, Node.js) with core features including admin login, agent creation, and list distribution via CSV, XLSX or XLS upload.

---

## 🚀 Features

### 🔐 1. Admin User Login
- Login form with:
  - Email
  - Password
- Used **JWT** for authentication.
- Redirect to dashboard on success.
- Show error messages on failure.

### 👤 2. Agent Creation
- Admin can create.
- Each agent includes:
  - Name
  - Email
  - Mobile Number (with country code)
  - Password

### 📤 3. Uploading and Distributing Lists
- Upload CSV, XLSX, or XLS files with:
  - `FirstName` (Text)
  - `Phone` (Number)
  - `Notes` (Text)

---

## ⚙️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT

---

### 🔐 Environment Variables

Set up environment variables for both backend and frontend:

#### Server (`server/.env`)

Create a file named `.env` in the `server/` folder:

```env
PORT=5000
MONGODB_URI
JWT_SECRET


#### Server (`client/.env`)

Create a file named `.env` in the `client/` folder:

```env
VITE_BASE_URL



