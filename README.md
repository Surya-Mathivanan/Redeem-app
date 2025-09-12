# Redeem Code Distributor

A comprehensive web application for managing and distributing Google Pay redeem codes with robust user authentication, tracking, and security features. This platform allows users to securely register, login, add redeem codes, and track their usage while preventing misuse through advanced monitoring systems.

## 📌 Project Overview

The Google Pay Redeem Code Distributor is a full-stack web application that enables users to share and redeem Google Pay reward codes in a controlled environment. The system features secure user authentication, real-time code tracking, misuse prevention, and an intuitive user interface built with React. It ensures data integrity, prevents unauthorized access, and maintains a clean database through automated cleanup processes.

## 🚀 Features

- **User Authentication**: Secure registration and login system with email validation
- **Code Management**: Add, view, archive, and manage redeem codes with titles and descriptions
- **Copy Tracking**: Track how many times each code has been copied with unique user constraints
- **User Dashboard**: View personal statistics including codes added and copy counts
- **Archive System**: Archive expired or unused codes for better organization
- **Misuse Prevention**: Advanced logging and suspension system for suspicious activities
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Live tracking of code usage and user activities
- **Session Management**: Secure session handling with automatic logout on inactivity

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: React.js with modern hooks and context API
- **Authentication**: JWT tokens with bcrypt password hashing
- **Security**: Helmet for security headers, CORS configuration
- **Deployment**: Configured for Vercel and Render deployment

## 📂 Project Structure

```
Redeem-app/
│
├── backend/                          # Node.js/Express backend
│   ├── controllers/                  # Route controllers
│   │   ├── authController.js         # Authentication logic
│   │   ├── codeController.js         # Code management logic
│   │   └── userController.js         # User management logic
│   ├── middleware/                   # Custom middleware
│   │   ├── authMiddleware.js         # JWT authentication middleware
│   │   └── errorMiddleware.js        # Error handling middleware
│   ├── models/                       # MongoDB schemas
│   │   ├── userModel.js              # User schema
│   │   ├── redeemCodeModel.js        # Redeem code schema
│   │   ├── copyModel.js              # Copy tracking schema
│   │   ├── misuseLogModel.js         # Misuse logging schema
│   │   └── suspensionModel.js        # User suspension schema
│   ├── routes/                       # API routes
│   │   ├── auth.js                   # Authentication routes
│   │   ├── codes.js                  # Code management routes
│   │   └── users.js                  # User management routes
│   ├── package.json                  # Backend dependencies
│   └── server.js                     # Main server file
│
├── frontend/                         # React frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/               # Reusable components
│   │   │   ├── CodeCard.js           # Code display component
│   │   │   └── Layout.js             # Main layout component
│   │   ├── context/                  # React context
│   │   │   └── AuthContext.js        # Authentication context
│   │   ├── pages/                    # Page components
│   │   │   ├── Login.js              # Login page
│   │   │   ├── Register.js           # Registration page
│   │   │   ├── Home.js               # Home/dashboard page
│   │   │   ├── AddCode.js            # Add code page
│   │   │   ├── Account.js            # User account page
│   │   │   ├── Dashboard.js          # Statistics dashboard
│   │   │   ├── Archive.js            # Archived codes page
│   │   │   └── NotFound.js           # 404 page
│   │   ├── services/                 # API services
│   │   │   └── api.js                # API client functions
│   │   ├── App.js                    # Main app component
│   │   └── index.js                  # App entry point
│   ├── package.json                  # Frontend dependencies
│   └── build/                        # Production build
│
├── package.json                      # Root package.json
├── vercel.json                       # Vercel deployment config
├── render.yaml                       # Render deployment config
└── README.md                         # This file
```

## 🔄 Application Flow Diagram

```
┌─────────────┐
│    Start    │
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────────┐
│  Register   │◄────┤   Login Page    │
│   / Login   │     └─────────────────┘
└──────┬──────┘
       │
       ▼
┌─────────────┐     No
│ Authenticate│─────────────┐
│  User       │             │
└──────┬──────┘             │
       │ Yes                │
       ▼                    │
┌─────────────┐             │
│   Success   │             │
└──────┬──────┘             │
       │                    │
       ▼                    ▼
┌─────────────┐     ┌─────────────┐
│  Dashboard  │     │   Error     │
│             │     │  Message    │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ View Stats  │◄────┤ Add New     │
│             │     │ Code        │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│   Home      │     │ Save to     │
│   Page      │     │ Database    │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ View All    │◄────┤ Copy Code   │
│ Codes       │     │ (Button)    │
└──────┬──────┘     └──────┬──────┘
       │                   │
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Check if    │     │ Already     │
│ Copied      │     │ Copied?     │
└──────┬──────┘     └──────┬──────┘
       │                   │
       │ No                │ Yes
       ▼                   ▼
┌─────────────┐     ┌─────────────┐
│ Copy to     │     │ Show        │
│ Clipboard   │     │ Message     │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│ Log Copy    │◄────┤ Increment   │
│ in Database │     │ Count       │
└──────┬──────┘     └─────────────┘
       │
       ▼
┌─────────────┐
│ Account     │
│ Page        │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Logout    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Clear       │
│ Session     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  End        │
└─────────────┘
```

## 🏗️ Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- MongoDB (local installation or cloud service like MongoDB Atlas)
- Git (for cloning the repository)

### Detailed Installation Steps

1. **Clone the Repository**
   ```
   git clone <repository-url>
   cd Redeem-app
   ```

2. **Backend Setup**
   - Navigate to the backend directory:
     ```
     cd backend
     ```
   - Install backend dependencies:
     ```
     npm install
     ```
   - Create a `.env` file in the backend directory with the following variables:
     ```
     NODE_ENV=development
     PORT=5000
     MONGO_URI=mongodb://localhost:27017/redeem_app
     JWT_SECRET=your_super_secret_jwt_key_here
     JWT_EXPIRE=30d
     ```
     Replace `MONGO_URI` with your MongoDB connection string if using a cloud service.

3. **Frontend Setup**
   - Open a new terminal and navigate to the frontend directory:
     ```
     cd frontend
     ```
   - Install frontend dependencies:
     ```
     npm install
     ```

4. **Database Configuration**
   - Ensure MongoDB is running locally or your cloud database is accessible
   - The application will automatically create the necessary collections when you start the server
   - No manual database schema creation is required as Mongoose handles schema definition

5. **Environment Variables**
   - For production deployment, update the environment variables in your deployment platform
   - Ensure `NODE_ENV` is set to `production` for production builds

6. **Running the Application**
   - Start the backend server:
     ```
     cd backend
     npm start
     ```
     The backend will run on `http://localhost:5000`
   - In a separate terminal, start the frontend:
     ```
     cd frontend
     npm start
     ```
     The frontend will run on `http://localhost:3000`

7. **Access the Application**
   - Open your web browser
   - Navigate to `http://localhost:3000`
   - The application will automatically connect to the backend API

## 📖 Usage

### First Time Setup

1. **User Registration**
   - Click on the "Register" link on the login page
   - Fill in your name, email, and password
   - Password must be at least 6 characters long
   - Click "Register" to create your account
   - You'll be redirected to the login page

2. **User Login**
   - Enter your registered email and password
   - Click "Login" to authenticate
   - Upon successful login, you'll be redirected to the dashboard

### Core Features

#### Dashboard
- View your personal statistics
- See total codes added by you
- Monitor copy counts for your codes
- Access quick navigation to other sections

#### Adding Codes
- Navigate to "Add Code" from the dashboard
- Enter a title for your code (e.g., "₹100 Cashback")
- Enter the actual redeem code
- Click "Add Code" to save it to the database
- Codes are immediately visible to other users on the home page

#### Home Page
- Browse all available redeem codes in card format
- Each card shows the code title, creator, and copy count
- Click the "Copy" button to copy the code to your clipboard
- Each user can copy each code only once
- Real-time updates show current copy counts

#### Account Management
- View your profile information
- Change password if needed
- Logout from the application
- View account status (active/suspended)

#### Archive System
- View codes that have been archived
- Archive your own codes when they're no longer valid
- Archived codes are hidden from the main home page

### Advanced Features

- **Copy Tracking**: The system prevents duplicate copies by the same user
- **Real-time Updates**: Copy counts update immediately across all users
- **Session Security**: Automatic logout after period of inactivity
- **Responsive Design**: Optimized for mobile and desktop use

## 🗄️ Database Schema

### Users Collection
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, min 6 chars, hashed),
  isSuspended: Boolean (default: false),
  suspendedUntil: Date (default: null),
  createdAt: Date,
  updatedAt: Date
}
```

### RedeemCodes Collection
```javascript
{
  title: String (required),
  code: String (required),
  user: ObjectId (ref: 'User', required),
  copyCount: Number (default: 0),
  isArchived: Boolean (default: false),
  createdAt: Date,
  updatedAt: Date
}
```

### Copies Collection
```javascript
{
  user: ObjectId (ref: 'User', required),
  redeemCode: ObjectId (ref: 'RedeemCode', required),
  createdAt: Date,
  updatedAt: Date
}
// Unique compound index on (user, redeemCode)
```

### MisuseLogs Collection
```javascript
{
  user: ObjectId (ref: 'User', required),
  actionType: String (enum: ['RAPID_COPYING', 'MULTIPLE_ACCOUNTS', 'SUSPICIOUS_ACTIVITY', 'OTHER']),
  details: String (required),
  createdAt: Date,
  updatedAt: Date
}
```

### Suspensions Collection
```javascript
{
  user: ObjectId (ref: 'User', required),
  reason: String (required),
  suspendedUntil: Date (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 Security Features

- **Password Hashing**: Uses bcrypt with salt rounds for secure password storage
- **JWT Authentication**: JSON Web Tokens for stateless session management
- **Input Validation**: Comprehensive validation for all user inputs
- **SQL Injection Prevention**: Parameterized queries with Mongoose
- **CORS Configuration**: Controlled cross-origin resource sharing
- **Helmet Security Headers**: Security headers to protect against common vulnerabilities
- **Rate Limiting**: Prevents brute force attacks on authentication endpoints
- **User Suspension System**: Automatic suspension for suspicious activities
- **Misuse Logging**: Detailed logging of potentially harmful actions
- **Session Expiry**: Automatic logout after configurable period of inactivity

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - **Symptom**: Application fails to start with MongoDB connection errors
   - **Solution**:
     - Ensure MongoDB is running locally or your cloud database is accessible
     - Check the `MONGO_URI` in your `.env` file
     - Verify network connectivity if using MongoDB Atlas
     - Check firewall settings if applicable

2. **Module Import Error**
   - **Symptom**: `npm install` fails or runtime import errors
   - **Solution**:
     - Delete `node_modules` folder and `package-lock.json`
     - Run `npm install` again
     - Ensure you're using the correct Node.js version (14+)
     - Check for conflicting package versions

3. **Port Already in Use**
   - **Symptom**: Error message "Port 5000 is already in use"
   - **Solution**:
     - Change the port in `backend/server.js` or `.env` file
     - Find and kill the process using the port: `npx kill-port 5000`
     - Use a different port like 5001

4. **Frontend Build Errors**
   - **Symptom**: React app fails to compile
   - **Solution**:
     - Clear npm cache: `npm cache clean --force`
     - Delete `node_modules` and reinstall
     - Check for syntax errors in React components
     - Ensure all dependencies are compatible

5. **Authentication Issues**
   - **Symptom**: Unable to login or register
   - **Solution**:
     - Verify email format is correct
     - Ensure password meets minimum requirements
     - Check JWT_SECRET is properly set
     - Clear browser cache and cookies

6. **CORS Errors**
   - **Symptom**: Browser console shows CORS-related errors
   - **Solution**:
     - Ensure backend is running on the correct port
     - Check CORS configuration in `backend/server.js`
     - Verify frontend is making requests to the correct backend URL

### Debug Mode

- Set `NODE_ENV=development` in `.env` for detailed error logging
- Check browser developer tools for network and console errors
- Monitor MongoDB logs for database-related issues
- Use tools like Postman to test API endpoints independently

## 📸 Screenshots

### Login Page
![Login Page](https://github.com/user-attachments/assets/3cdf1947-c983-497f-a55d-81a5440605ec)

### Register Page
![Register Page](https://github.com/user-attachments/assets/771d5513-d5df-41ca-a1e2-fdf811ee7f18)

### Home Page
![Home Page](https://github.com/user-attachments/assets/110241e4-d2f4-4777-aa6a-995fc121541d)

### Account Page
![Account Page](https://github.com/user-attachments/assets/95e30b15-08cc-4bbc-8176-506cc81bd8bf)

### Add Code Page
![Add Code Page](https://github.com/user-attachments/assets/b2aa4164-bfaf-4383-83ca-6cad42babd44)

### Dashboard Page
![Dashboard Page](https://github.com/user-attachments/assets/c9c8dfce-a0ee-4019-83ae-55ed493e598c)

### Archive Page
![Archive Page](https://github.com/user-attachments/assets/587f4268-8f2b-4f48-9d70-abdfb59ee9af)

## 🚀 Deployment

### Vercel Deployment (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build settings:
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Render Deployment (Backend)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build and start commands:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in Render dashboard
5. Deploy and get your backend URL

### Environment Variables for Production
```
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRE=30d
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## 🤝 Contributing

We welcome contributions to improve the Google Pay Redeem Code Distributor!

### How to Contribute

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add some feature'`
5. Push to the branch: `git push origin feature/your-feature-name`
6. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write clear, concise commit messages
- Test your changes before submitting
- Update documentation if needed
- Ensure all dependencies are properly listed

### Areas for Contribution

- UI/UX improvements
- Additional security features
- Performance optimizations
- Mobile app development
- API enhancements
- Testing implementation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

If you encounter any issues or have questions:

1. Check the troubleshooting section above
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Include error messages, steps to reproduce, and your environment details

## 🔄 Future Enhancements

- [ ] Implement OTP-based two-factor authentication
- [ ] Add email notifications for code expiration
- [ ] Develop mobile applications (iOS/Android)
- [ ] Implement advanced analytics and reporting
- [ ] Add code categories and filtering
- [ ] Integrate with Google Pay API for validation
- [ ] Add bulk code import/export functionality
- [ ] Implement real-time notifications
- [ ] Add user roles and permissions
- [ ] Create admin dashboard for system management
