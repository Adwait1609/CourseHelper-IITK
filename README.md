# Course Helper

Course Helper is a web application that allows users to manage their courses. Users can register, log in, and manage their course catalog including adding, editing, and deleting courses.

## Features

- User authentication (signup, login, profile management)
- Course management (add, view, edit, delete)
- Responsive UI with Material UI components

## Project Structure

The project is divided into two main parts:

### Backend

- Node.js Express server
- PostgreSQL database
- JWT authentication
- RESTful API endpoints

### Frontend

- React.js with Material UI
- React Router for navigation
- Axios for API requests
- Responsive design

## Setup Instructions

### Prerequisites

- Node.js (v16+ recommended)
- Git

## Database Setup Options

### Option 1: Local PostgreSQL Database (Development)

1. Install PostgreSQL on your local machine
   - [Download PostgreSQL](https://www.postgresql.org/download/)
   - Follow the installation instructions for your operating system

2. Create a new database:
   ```
   psql -U postgres
   CREATE DATABASE coursehelper;
   ```

3. Update the `.env` file in the Backend directory:
   ```
   DATABASE_URL=postgresql://postgres:your_password@localhost:5432/coursehelper
   PORT=5000
   DATABASE_SSL=false
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=1h
   ```

### Option 2: Free PostgreSQL Cloud Hosting (Production)

Several services offer free PostgreSQL hosting:

1. **Supabase**:
   - Go to [Supabase](https://supabase.com/)
   - Sign up for a free account
   - Create a new project
   - In the project dashboard, go to Settings > Database to find your connection string
   - Update your `.env` file with the connection string:
     ```
     DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
     DATABASE_SSL=true
     ```

2. **Railway**:
   - Go to [Railway](https://railway.app/)
   - Sign up for a free account
   - Create a new PostgreSQL database
   - The connection details will be available in the project dashboard
   - Update your `.env` file with the connection string

3. **Neon**:
   - Go to [Neon](https://neon.tech/)
   - Sign up for a free account
   - Create a new project
   - The connection string will be provided
   - Update your `.env` file with the connection string
   - Free tier includes 3GB storage and no time limits

4. **ElephantSQL**:
   - Go to [ElephantSQL](https://www.elephantsql.com/)
   - Sign up for a free account
   - Create a new instance (Tiny Turtle plan is free)
   - Get the connection details from the dashboard
   - Update your `.env` file with the connection string
   - Free tier includes 20MB storage and 5 concurrent connections

### Application Setup

#### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create the database schema:
   - The schema will be automatically created when you start the server for the first time
   - If you want to manually create it, you can run the SQL commands from `db/schema.sql`

4. Start the backend server:
```bash
npm run dev
```

The server should start on port 5000 (or the port specified in your .env file).

#### Frontend Setup

1. Navigate to the Front-End directory:
```bash
cd Front-End
```

2. Install dependencies:
```bash
npm install
```

3. Update the API base URL (if needed):
   - Open `src/api.js` or directly in the components where API calls are made
   - Change the base URL if your backend is hosted somewhere other than localhost:3001

4. Start the frontend development server:
```bash
npm run dev
```

The frontend should start on port 5173 (default Vite port).

## Deployment Options

### Frontend Deployment (Free Options)

1. **Netlify**:
   - Create a free account on [Netlify](https://www.netlify.com/)
   - Build your frontend:
     ```bash
     cd Front-End
     npm run build
     ```
   - Drag and drop the `dist` folder to Netlify or connect your GitHub repository
   - Configure environment variables if needed

2. **Vercel**:
   - Create a free account on [Vercel](https://vercel.com/)
   - Connect your GitHub repository
   - Configure the build settings (framework preset: Vite)
   - Deploy automatically from your repository

3. **GitHub Pages**:
   - Build your frontend:
     ```bash
     cd Front-End
     npm run build
     ```
   - Add a `deploy` script to your `package.json`:
     ```json
     "deploy": "gh-pages -d dist"
     ```
   - Install gh-pages: `npm install --save-dev gh-pages`
   - Deploy: `npm run deploy`

### Backend Deployment (Free Options)

1. **Railway**:
   - Create a free account on [Railway](https://railway.app/)
   - Connect your GitHub repository
   - Set up environment variables
   - Deploy from your repository

2. **Render**:
   - Create a free account on [Render](https://render.com/)
   - Create a new Web Service
   - Connect your GitHub repository
   - Configure build and start commands
   - Set up environment variables
   - Free tier goes to sleep after 15 minutes of inactivity

3. **Fly.io**:
   - Create a free account on [Fly.io](https://fly.io/)
   - Install their CLI tool
   - Deploy using their CLI
   - Free tier includes 3 small shared-CPU VMs

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Courses

- `GET /api/courses` - Get all courses for the logged-in user (protected)
- `GET /api/courses/:id` - Get a specific course (protected)
- `POST /api/courses` - Add a new course (protected)
- `PUT /api/courses/:id` - Update a course (protected)
- `DELETE /api/courses/:id` - Delete a course (protected)

## Database Schema

### Users Table

```sql
CREATE TABLE myschema.users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    profile_picture VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### Courses Table

```sql
CREATE TABLE myschema.courses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    description TEXT,
    credit INTEGER,
    image VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES myschema.users(id) ON DELETE CASCADE
);
```

## License

This project is licensed under the MIT License.
