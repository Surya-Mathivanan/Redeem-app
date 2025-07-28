import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});

// Override baseURL if we're in production and deployed to Render
if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
  // Use absolute URL to your Render backend
  api.defaults.baseURL = 'https://redeem-app-5.onrender.com';
}

// Add request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

## Prerequisites
- Your GitHub repository with the frontend code
- Your backend already deployed at `https://redeem-app-5.onrender.com/`

## Step 1: Create a Static Site on Render

1. **Log in to Render Dashboard**
   - Go to [render.com](https://render.com) and sign in with your GitHub account

2. **Create a New Static Site**
   - Click the "New +" button in the top right
   - Select "Static Site" from the dropdown menu

3. **Connect to Your Repository**
   - Connect to your GitHub account if not already connected
   - Select your repository: `gpay-reward-application`

## Step 2: Configure the Static Site

1. **Basic Settings**
   - **Name**: Choose a name like `gpay-reward-app-frontend`
   - **Branch**: Select your main branch (usually `main` or `master`)

2. **Build Configuration**
   - **Root Directory**: `frontend` (since your React app is in the frontend folder)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build` (this is where Create React App outputs the build files)

3. **Advanced Settings**
   - Click "Advanced" to expand additional options
   - Add environment variables if needed (typically `NODE_ENV=production`)

## Step 3: Update API Configuration

Before deploying, you need to modify your API service to point to your Render backend:

1. **Update your API service**
   - Open `frontend/src/services/api.js`
   - Modify the production configuration to use your Render backend URL:
```javascript
import axios from 'axios';

// Create axios instance with base URL from environment variable
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || ''
});

// Override baseURL if we're in production and deployed to Render
if (process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost') {
  // Use absolute URL to your Render backend
  api.defaults.baseURL = 'https://redeem-app-5.onrender.com';
}

// Add request interceptor to set auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;