# Google Pay Redeem Code Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing and distributing Google Pay redeem codes with user authentication and tracking.

## Features

- **User Authentication**: Registration and login system
- **Code Management**: Add, view, and copy redeem codes
- **Copy Tracking**: Track how many times each code has been copied
- **User Dashboard**: View personal statistics
- **Archive System**: Archive codes that are no longer needed
- **Anti-Misuse System**: Prevent abuse of the platform
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication

### Frontend
- React.js
- React Router
- Bootstrap 5
- Axios
- React Toastify
- Font Awesome

## Project Structure

```
/
├── backend/                # Express.js backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
│
├── frontend/              # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context API files
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── App.js         # Main component
│   │   └── index.js       # Entry point
│   ├── .env.local         # Environment variables
│   └── package.json       # Frontend dependencies
│
├── vercel.json            # Vercel deployment configuration
├── .gitignore             # Git ignore file
└── README.md              # Project documentation
```

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend (.env.local)

```
REACT_APP_API_URL=/api
```

## Local Development Setup

1. Clone the repository

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

4. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Create a `.env.local` file in the frontend directory

5. Run the development server:
   ```bash
   # In the backend directory
   npm run server
   
   # In the frontend directory (in a separate terminal)
   npm start
   ```

6. Access the application:
   - Backend API: http://localhost:5000
   - Frontend: http://localhost:3000

## Deployment

This application is configured for deployment on Vercel. See the [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

## License

MIT
