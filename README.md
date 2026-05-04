# Team Task Manager

A full-stack MERN (MongoDB, Express, React, Node.js) application for team collaboration and task management.

## 🚀 Features
- **Authentication**: Secure JWT-based login and signup with role-based access (Admin & Member).
* **Dashboard**: Real-time overview of tasks (Total, Completed, Pending, Overdue).
* **Team Management**: Admin view to manage all team members.
* **Project Management**: Organize work into projects and add team members.
* **Task Management**: Create, assign, and track tasks with status updates.

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Auth**: JSON Web Tokens (JWT), Bcrypt.js.

## 📦 Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/mohitpatwal17/ETHARA.ai.git
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret_key
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🚀 Deployment (Railway)

### 1. Backend Deployment
- Connect your GitHub repo to Railway.
- Create a new **Web Service** and point it to the `backend/` directory.
- Add Environment Variables:
  - `PORT`: 5000
  - `MONGO_URI`: (Create a MongoDB service on Railway and use its connection string)
  - `JWT_SECRET`: (Your secret key)
  - `NODE_ENV`: production

### 2. Frontend Deployment
- Create another **Web Service** pointing to the `frontend/` directory.
- Add Environment Variables:
  - `VITE_API_URL`: (The URL of your deployed backend + `/api`)
- Railway will automatically run `npm run build` and serve the `dist` folder.

## 📜 License
MIT
