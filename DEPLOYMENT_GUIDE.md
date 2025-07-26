# GPay Reward Application - Render Deployment Guide

## Prerequisites
- GitHub repository with your code
- MongoDB Atlas cluster set up
- MONGO_URI connection string
- SECRET_KEY for Flask sessions

## Deployment Steps

### 1. Push Code to GitHub
Make sure all your code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2. Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up or log in with your GitHub account

### 3. Create New Web Service
1. Click "New +" button in Render dashboard
2. Select "Web Service"
3. Connect your GitHub repository
4. Select your repository: `Surya-Mathivanan/Redeem-app`

### 4. Configure Service Settings
- **Name**: `gpay-reward-app` (or your preferred name)
- **Environment**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `gunicorn app:app`
- **Instance Type**: Free tier is sufficient for testing

### 5. Set Environment Variables
In the Render dashboard, add these environment variables:

**Required Variables:**
- `MONGO_URI`: Your MongoDB Atlas connection string
- `SECRET_KEY`: Your Flask secret key
- `FLASK_DEBUG`: `False` (for production)

**Optional Variables:**
- `PORT`: Render will set this automatically

### 6. Deploy
1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Monitor the build logs for any issues

### 7. Access Your Application
Once deployed, your application will be available at:
`https://your-service-name.onrender.com`

## Important Notes

### MongoDB Atlas Configuration
Ensure your MongoDB Atlas cluster allows connections from anywhere (0.0.0.0/0) or add Render's IP ranges to your whitelist.

### Environment Variables Security
- Never commit `.env` files to your repository
- Use Render's environment variable settings for sensitive data
- Your `.gitignore` already excludes `.env` files

### Application Features
Your deployed application includes:
- User registration and authentication
- Redeem code management
- Copy tracking with limits (max 5 copies per code)
- Anti-abuse system with user suspension
- Archive system for expired/exhausted codes
- Responsive web interface

### Monitoring
- Check Render logs for any runtime issues
- Monitor MongoDB Atlas for database performance
- Set up alerts for application errors

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check requirements.txt for correct package versions
2. **Database Connection**: Verify MONGO_URI format and Atlas whitelist
3. **Application Errors**: Check Render logs and ensure all environment variables are set

### Support:
- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/

## Post-Deployment
1. Test all application features
2. Verify user registration and login
3. Test code creation and copying functionality
4. Check archive and dashboard pages
5. Monitor for any performance issues

Your application is now ready for production use!
