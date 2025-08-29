# Deployment Guide

This guide provides step-by-step instructions for deploying the Course Helper application for free.

## Database Deployment (Free Options)

### Option 1: Neon (Recommended)

[Neon](https://neon.tech/) offers a free PostgreSQL database with 3GB storage and no time limits.

1. Sign up for a free account at [https://neon.tech/](https://neon.tech/)
2. Create a new project
3. In your project, you'll get a connection string. It will look like:
   ```
   postgresql://username:password@endpoint-name.neon.tech/database
   ```
4. Update your `.env` file with this connection string:
   ```
   DATABASE_URL=postgresql://username:password@endpoint-name.neon.tech/database
   DATABASE_SSL=true
   ```

### Option 2: ElephantSQL

[ElephantSQL](https://www.elephantsql.com/) offers a free tier with 20MB storage.

1. Sign up for a free account at [https://www.elephantsql.com/](https://www.elephantsql.com/)
2. Create a new instance (select "Tiny Turtle - Free" plan)
3. Go to instance details to find your connection URL
4. Update your `.env` file with this connection string:
   ```
   DATABASE_URL=postgres://username:password@hostname/database
   DATABASE_SSL=true
   ```

## Backend Deployment (Free Options)

### Option 1: Render (Recommended)

[Render](https://render.com/) offers a free tier for web services.

1. Sign up for a free account at [https://render.com/](https://render.com/)
2. From the dashboard, click "New" and select "Web Service"
3. Connect your GitHub repository or upload the code directly
4. Configure your service:
   - Name: course-helper-api
   - Environment: Node
   - Build Command: `cd Backend && npm install`
   - Start Command: `cd Backend && npm start`
5. Add environment variables (from your `.env` file)
6. Click "Create Web Service"

**Note**: Free services on Render will spin down after 15 minutes of inactivity. They'll automatically spin up when receiving a new request, but there may be a brief delay.

### Option 2: Railway

[Railway](https://railway.app/) offers a free tier with limited usage.

1. Sign up for a free account at [https://railway.app/](https://railway.app/)
2. From the dashboard, create a new project
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account and select your repository
5. Configure your service with environment variables
6. Deploy the backend

## Frontend Deployment (Free Options)

### Option 1: Netlify (Recommended)

[Netlify](https://www.netlify.com/) offers a generous free tier for static website hosting.

1. Sign up for a free account at [https://www.netlify.com/](https://www.netlify.com/)
2. From the dashboard, click "Add new site" > "Import an existing project"
3. Connect your GitHub repository or upload the code directly
4. Configure your build settings:
   - Base directory: `Front-End`
   - Build command: `npm run build`
   - Publish directory: `Front-End/dist`
5. Add environment variables if needed
6. Click "Deploy site"

**Important**: Update the API URL in your frontend code to point to your deployed backend:

```javascript
// In your API calls, update the base URL
const API_URL = 'https://your-backend-url.render.com/api';
```

### Option 2: Vercel

[Vercel](https://vercel.com/) is another excellent free option for frontend hosting.

1. Sign up for a free account at [https://vercel.com/](https://vercel.com/)
2. From the dashboard, click "Add New" > "Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Vite
   - Root Directory: `Front-End`
5. Add environment variables if needed
6. Click "Deploy"

## Testing Your Deployment

1. Test your backend:
   - Visit your backend URL to see if it's running: `https://your-backend-url.render.com/api`
   - You should see a JSON response confirming the API is running

2. Test your frontend:
   - Visit your frontend URL
   - Try to sign up and log in
   - Test course creation and management

## Troubleshooting

### Database Connection Issues

- Check your database connection string in the backend `.env` file
- Ensure the database is properly configured for external access
- Test the connection using the `test-db.js` script:
  ```
  cd Backend
  npm run test:db
  ```

### Backend Deployment Issues

- Check your environment variables on your hosting platform
- Review the deployment logs for errors
- Ensure your start command is correct
- Test API endpoints using the `test-api.js` script:
  ```
  cd Backend
  npm run test:api
  ```

### Frontend Deployment Issues

- Check if the frontend is properly built (look for a `dist` folder after running `npm run build`)
- Ensure the API URL is correctly updated to point to your deployed backend
- Check browser console for errors

## Ongoing Maintenance

- Free tiers of deployment services may have limitations:
  - Some services require periodic activity to prevent shutdowns
  - Storage and bandwidth limits may apply
  - Check the terms of service for each platform

## Further Resources

- [Neon Documentation](https://neon.tech/docs)
- [Render Documentation](https://render.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
