# Team Task Manager

This is a full-stack MERN application for managing team projects and tasks. Users can sign up as either an Admin or a Member. Admins have full control over projects and tasks, while members can view their assigned projects and update task statuses.

## Features

- **Authentication**: JWT-based login and signup with role-based access (Admin/Member).
- **Dashboard**: View summary of tasks (Total, Completed, Pending, Overdue).
- **Projects**: Admins can create projects and add members via email.
- **Tasks**: Admins can create, assign, and delete tasks. Members can update status.
- **Responsive UI**: Built with React and Tailwind CSS.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Security**: JWT for tokens, Bcrypt for password hashing

## Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed and running locally

### 1. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (one is already provided in this repo for local testing):
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=supersecretkey123
   ```
4. Start the server:
   ```bash
   npm start
   ```

### 2. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 3. Usage
- Open your browser to the Vite URL (usually `http://localhost:5173`).
- Sign up as an **Admin** to create projects and tasks.
- Copy the User ID of a member to assign tasks to them.

## Deployment
This app is ready to be deployed on platforms like Railway or Vercel/Render. Make sure to update the `MONGO_URI` and `JWT_SECRET` in your environment variables.
