NODE_ENV=development
PORT=5000
MONGO_URI=mongodb+srv://kit26ad59:ld40fTki6Q0BDjXG@cluster0.ge3lxlk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=abc123def456ghi789jkl# Vercel Deployment Guide for Google Pay Redeem Codes Application

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Node.js and npm installed on your local machine
3. Git installed on your local machine
4. MongoDB Atlas account (for database hosting)

## Environment Variables Setup

Before deploying to Vercel, you need to set up the following environment variables:

### Required Environment Variables

1. `NODE_ENV` - Set to "production"
2. `MONGO_URI` - Your MongoDB connection string
3. `JWT_SECRET` - Secret key for JWT token generation

## Deployment Steps

### 1. Prepare Your MongoDB Database

1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster or use an existing one
3. Set up database access (create a database user with password)
4. Set up network access (allow access from anywhere for Vercel deployment)
5. Get your MongoDB connection string

### 2. Deploy to Vercel

#### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory and deploy:
   ```bash
   cd path/to/gpay-reward-application
   vercel
   ```

4. Follow the prompts to configure your project

5. Set up environment variables when prompted or add them later in the Vercel dashboard

#### Option 2: Deploy via Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Log in to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "New Project"

4. Import your repository

5. Configure project settings:
   - Framework Preset: Other
   - Root Directory: ./
   - Build Command: cd frontend && npm install && npm run build
   - Output Directory: frontend/build

6. Add environment variables:
   - Go to Settings > Environment Variables
   - Add the following variables:
     - `NODE_ENV` = production
     - `MONGO_URI` = your_mongodb_connection_string
     - `JWT_SECRET` = your_jwt_secret

7. Click "Deploy"

### 3. Verify Deployment

1. Once deployment is complete, Vercel will provide you with a URL
2. Visit the URL to ensure your application is working correctly
3. Test all functionality including user registration, login, and code management

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Verify your MongoDB connection string is correct
   - Ensure network access is properly configured in MongoDB Atlas

2. **API Endpoint Errors**
   - Check that the frontend is correctly configured to use the API endpoints
   - Verify that the vercel.json configuration is correct

3. **Build Errors**
   - Check the build logs in Vercel dashboard
   - Ensure all dependencies are properly installed

### Viewing Logs

1. Go to your project in the Vercel dashboard
2. Click on the latest deployment
3. Click on "Functions" to see serverless function logs
4. Click on "Build Logs" to see build process logs

## Updating Your Deployment

To update your application after making changes:

1. Push changes to your Git repository
2. Vercel will automatically redeploy your application

Or, if using Vercel CLI:

```bash
vercel --prod
```

## Custom Domains

To use a custom domain with your Vercel deployment:

1. Go to your project in the Vercel dashboard
2. Click on "Settings" > "Domains"
3. Add your domain and follow the instructions to configure DNS settings

## Conclusion

Your Google Pay Redeem Codes Application should now be successfully deployed on Vercel. The application uses a serverless architecture where the backend API runs as serverless functions and the frontend is served as static files.