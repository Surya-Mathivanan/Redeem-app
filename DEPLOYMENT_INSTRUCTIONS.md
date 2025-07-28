# Deployment Instructions for Google Pay Redeem Codes Application

## Overview of the Fix

The application was experiencing CORS issues when making API calls from the Vercel-hosted frontend to the Render-hosted backend. The following changes have been made to fix these issues:

1. Updated the frontend API service to use relative URLs in production environments
2. Updated the Vercel configuration to handle CORS preflight requests
3. Updated the backend CORS configuration to allow requests from the Vercel domain

## Deployment Steps

### 1. Push Changes to GitHub

First, push all the changes to your GitHub repository:

```bash
git add .
git commit -m "Fix CORS issues and update API configuration"
git push
```

### 2. Deploy to Vercel

#### Option 1: Automatic Deployment

If you have already connected your GitHub repository to Vercel, the changes will be automatically deployed when you push to the repository.

#### Option 2: Manual Deployment

1. Log in to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to the "Deployments" tab
4. Click "Deploy" to trigger a new deployment

### 3. Verify the Deployment

1. Once the deployment is complete, visit your Vercel app URL
2. Test the registration and login functionality
3. Check the browser console for any CORS errors

## Troubleshooting

If you still encounter CORS issues after deployment, try the following:

1. **Clear Browser Cache**: Clear your browser cache and cookies, then try again

2. **Check Backend CORS Configuration**: Ensure the backend CORS configuration includes your Vercel domain. The current configuration allows requests from:
   - http://localhost:3000
   - https://redeem-app-6xhh.vercel.app
   - https://redeem-app-backend.onrender.com
   - https://redeem-app-mwd4.vercel.app

   If your Vercel domain is different, add it to the `origin` array in `backend/server.js`.

3. **Verify Vercel Configuration**: Check that your `vercel.json` file includes the CORS headers for API routes.

4. **Check API Service Configuration**: Verify that the frontend API service is configured to use relative URLs in production.

## Additional Notes

### Environment Variables

Make sure your Vercel project has the following environment variables set:

- `NODE_ENV`: Set to `production`

### Backend URL

The application is configured to use the backend at `https://redeem-app-backend.onrender.com`. If your backend URL is different, update it in the `vercel.json` file.

### API Routes

The application uses the following API routes:

- `/api/*`: Proxied to `https://redeem-app-backend.onrender.com/api/*`
- `/auth/*`: Proxied to `https://redeem-app-backend.onrender.com/api/auth/*`

## Contact

If you encounter any issues with the deployment, please contact the development team for assistance.