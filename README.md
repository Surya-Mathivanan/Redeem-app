# Redeem App - Redeem Code Management System

---

## 🎯 Project Overview

**Redeem App** is a secure, full-stack web application designed for managing and sharing redeem codes. This platform allows users to create, share, and manage redeem codes efficiently. To maintain code integrity and prevent overuse, the system automatically archives codes after 5 copies, ensuring fair distribution and preventing abuse.



---
## Live URL:
* [Redeem App](https://redeem-appp.vercel.app/)

---
## Interface
<img width="1366" height="765" alt="Image" src="https://github.com/user-attachments/assets/d51d1bd5-bddb-40c1-90ec-fc73b8d258dc" />
<img width="1366" height="765" alt="Image" src="https://github.com/user-attachments/assets/a58afbe5-8c5c-4def-bcff-7bc51f2cb73b" />
<img width="1366" height="764" alt="Image" src="https://github.com/user-attachments/assets/779de292-fffc-444f-a2d5-33687bcec663" />
<img width="1366" height="767" alt="Image" src="https://github.com/user-attachments/assets/718bcced-eccf-4c9a-bc07-79f82d3d3524" />
<img width="1347" height="763" alt="Image" src="https://github.com/user-attachments/assets/a7921a01-e962-4def-a5bc-f168d24651d0" />
<img width="1366" height="765" alt="Image" src="https://github.com/user-attachments/assets/45136185-89c6-4474-94d2-3731ac5977c2" />
<img width="1366" height="763" alt="Image" src="https://github.com/user-attachments/assets/3ecf49fc-24f7-4ba6-ba73-4ed8ee7aabfa" />








---

## 🛠️ Tech Stack

The Redeem App is built with a robust and modern technology stack, ensuring a scalable, responsive, and secure experience.
---

### Frontend

* **React JS** - UI framework
* **React Router v6** - Client-side routing
* **Axios** - HTTP client for API requests
* **React Hot Toast** - User-friendly notifications
* **Tailwind CSS** - Utility-first CSS framework for rapid styling
* **Vite** - Fast build tool and development server
---

### Backend

* **Node.js** - JavaScript runtime environment
* **Express.js** - Fast, unopinionated, minimalist web framework
* **MongoDB** - NoSQL database for flexible data storage
* **Mongoose** - ODM (Object Document Mapper) for MongoDB and Node.js
* **JWT (JSON Web Tokens)** - Secure authentication tokens
* **bcryptjs** - Library for hashing passwords
* **express-async-handler** - Middleware for handling asynchronous errors
---

### Deployment & DevOps

* **Vercel** - Frontend hosting
* **MongoDB Atlas** - Cloud database service
* **Render** - Backend hosting
* **Git** - Version control system

---

## ✨ Key Features

### User Management

* **Secure Authentication** - JWT-based login and registration for robust security.
* **Account Protection** - Automatic suspension for rapid copying attempts (5+ attempts/minute) to prevent abuse.
* **Profile Management** - Users can easily update their personal information.
---

### Code Management

* **Create Codes** - Add new redeem codes with descriptive titles.
* **Smart Archiving** - Codes are automatically archived once their `copyCount` reaches 5.
* **Copy Tracking** - Detailed tracking of who copied what and when.
* **Archive System** - View archived codes separately from active ones.
---

### Anti-Abuse System

* **Rapid Copying Prevention** - Users are suspended for 1 minute if they make 5 or more rapid copy attempts within a minute.
* **Copy Limits** - Each user can copy a specific code only once.
* **Activity Monitoring** - Comprehensive tracking and logging of suspicious user behavior.
---
### User Experience

* **Real-time Updates** - Instant feedback through toast notifications for user actions.
* **Responsive Design** - Optimized for seamless use across desktop and mobile devices.
* **Time-based Display** - User-friendly formatting for timestamps (e.g., "Just now", "X minutes ago", "Yesterday").
* **Copy Confirmation** - Visual feedback when codes are successfully copied.

---

## 🚀 Quick Start

Follow these steps to get the Redeem App up and running on your local machine for development.
---
### Prerequisites

* **Node.js** (v16 or higher)
* **MongoDB Atlas** account (or a local MongoDB instance)
* **npm** or **yarn** package manager
---
### Installation

1.  **Clone the Repository:**

    ```bash
    git clone [https://github.com/Surya-Mathivanan/Redeem-app.git](https://github.com/Surya-Mathivanan/Redeem-app.git)
    cd Redeem-app
    ```

2.  **Backend Setup:**

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory with the following variables:

    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    NODE_ENV=development
    ```

3.  **Frontend Setup:**

    ```bash
    cd frontend
    npm install
    ```

    Create a `.env` file in the `frontend` directory:

    ```env
    VITE_API_URL=http://localhost:5000/api
    ```
---
### Run Development Servers

1.  **Backend:**

    ```bash
    cd backend
    npm run dev
    ```

2.  **Frontend:**

    ```bash
    cd frontend
    npm run dev
    ```

    Open your web browser and navigate to the address provided by the frontend development server (usually `http://localhost:5173` or similar).

---

## 📁 Project Structure

```
Redeem-app/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React contexts for state management
│   │   └── services/     # API service integrations
│   └── public/           # Static assets
├── backend/              # Express API
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models (Mongoose schemas)
│   └── routes/           # API routes
├── README.md
└── vercel.json           # Deployment configuration for Vercel
```

---

## 🔧 API Endpoints

### Authentication

* `POST /api/auth/register` - Register a new user.
* `POST /api/auth/login` - User login.
* `GET /api/auth/me` - Get the current authenticated user's details.
* `PUT /api/auth/profile` - Update the user's profile information.
---
### Codes

* `GET /api/codes` - Retrieve active codes (where `copyCount` is less than or equal to 4).
* `GET /api/codes/archive` - Retrieve all archived codes.
* `GET /api/codes/user` - Get codes created by the current user.
* `POST /api/codes` - Create a new redeem code.
* `PUT /api/codes/:id` - Update an existing code by ID.
* `DELETE /api/codes/:id` - Delete a code by ID.
* `PUT /api/codes/:id/archive` - Manually archive a code.
* `PUT /api/codes/:id/unarchive` - Unarchive a code.
* `POST /api/codes/:id/copy` - Copy a code (increments its `copyCount`).

---

## 🎯 Core Logic

### Automatic Archiving

* Codes are automatically moved to the archive when their `copyCount` reaches 5 or more.
* Archived codes are no longer displayed on the main "Home" page but are accessible on the "Archive" page.
* Users can still view and manage archived codes they originally created.
---
### Suspension System

* A user attempting to copy 5 or more codes within a 1-minute window will be suspended for 1 minute.
* Suspension messages provide clear, formatted timestamps.
* The system automatically lifts the suspension after the 1-minute period.
---
### Copy Tracking

* Every successful code copy creates a record in the dedicated `Copy` collection.
* This system prevents users from copying the same code multiple times.
* It enables precise tracking of copy counts and comprehensive monitoring of user activity.

---

## 🌐 Deployment

### Frontend (Vercel)

1.  Navigate to the `frontend` directory.
2.  Run `vercel --prod` to deploy to Vercel.

### Backend (Render)

1.  Connect your GitHub repository to Render.
2.  Set the necessary environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `NODE_ENV`) in the Render dashboard.
3.  Render is configured to deploy automatically on pushes to the `main` branch.

---

## 📝 Environment Variables

### Backend (`.env` in `backend/`)

* `PORT` - The port on which the server will run (default: `5000`).
* `MONGO_URI` - Your MongoDB connection string.
* `JWT_SECRET` - A secret key used for signing JWT tokens.
* `NODE_ENV` - The environment setting (e.g., `development`, `production`).

### Frontend (`.env` in `frontend/`)

* `VITE_API_URL` - The base URL for your backend API (e.g., `http://localhost:5000/api` for development).

---

## 🧪 Development Tips

* Use **MongoDB Compass** or **MongoDB Atlas UI** for visual database management and inspection.
* Regularly check your **browser's developer tools** (Console and Network tabs) for API call status and real-time responses.
* Utilize **Postman** or **Insomnia** for comprehensive API testing during development.

---

## 🔒 Security Features

* **Password Hashing** - Implemented with `bcryptjs` to securely store user passwords.
* **JWT Token Authentication** - Ensures secure user sessions and API access.
* **Rate Limiting** - Applied to copy attempts to prevent brute-force attacks and abuse.
* **Input Validation** - All API endpoints include robust input validation to prevent malicious data.
* **CORS Configuration** - Properly configured for secure communication between frontend and backend in production.

---

## 🎨 UI/UX Features

* **Responsive Design** - Adapts seamlessly to various screen sizes, from mobile phones to large desktops.
* **Loading States** - Provides visual feedback during data fetching for a smoother user experience.
* **Toast Notifications** - Delivers real-time, non-intrusive feedback for user actions.
* **Real-time Copy Count Updates** - Instantly reflects changes in code copy counts.
* **Intuitive Navigation** - Easy switching between "Home" (active codes) and "Archive" pages.

---

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
