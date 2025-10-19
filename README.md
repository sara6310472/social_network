# Social Network Platform 🌐

A complete full-stack social media platform with React frontend and Node.js backend. Features secure authentication, real-time updates, and professional-grade architecture suitable for production use.

## ✨ Features

### Frontend
- **Modern React UI** - Responsive and interactive interface
- **JWT Authentication** - Secure login and registration
- **Real-time Feed** - Live updates without page refresh
- **User Profiles** - Comprehensive profile management
- **File Upload** - Image sharing with optimization

### Backend
- **RESTful API** - Well-structured endpoints
- **Secure Authentication** - JWT with refresh tokens
- **Database Integration** - MongoDB/PostgreSQL support
- **File Management** - Image upload and processing
- **Error Handling** - Professional error responses

## 🛠️ Tech Stack

### Frontend
- **React** - Modern UI development
- **React Hooks** - State management
- **Axios** - HTTP client
- **CSS3/Styled Components** - Professional styling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB/PostgreSQL** - Database
- **JWT** - Authentication
- **Multer** - File uploads
- **bcrypt** - Password hashing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB/PostgreSQL
- npm/yarn

### Installation

```bash
# Clone repository
git clone <repository-url>
cd social-network

# Install server dependencies
cd server
npm install

# Install client dependencies  
cd ../client
npm install

# Setup environment variables (server/.env)
PORT=5000
DB_URI=your_database_url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Start server (from server directory)
npm run dev

# Start client (from client directory, new terminal)
npm start
```

## 📁 Project Structure

```
social-network/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   ├── services/      # API calls
│   │   └── utils/         # Helper functions
│   └── package.json
│
├── server/                # Node.js backend
│   ├── controllers/       # Route handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   └── package.json
```

## 🔑 API Endpoints

### Authentication
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/refresh     # Refresh token
POST /api/auth/logout      # User logout
```

### Users
```http
GET    /api/users/profile  # Get user profile
PUT    /api/users/profile  # Update profile
GET    /api/users/:id      # Get user by ID
POST   /api/users/follow   # Follow user
```

### Posts
```http
GET    /api/posts          # Get all posts
POST   /api/posts          # Create post
PUT    /api/posts/:id      # Update post
DELETE /api/posts/:id      # Delete post
POST   /api/posts/:id/like # Like post
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Encryption** - bcrypt hashing
- **Input Validation** - Request data validation
- **CORS Protection** - Cross-origin security
- **Rate Limiting** - API request limiting
- **SQL Injection Protection** - Parameterized queries

## 🚀 Deployment

### Heroku (Backend)
```bash
# Install Heroku CLI
npm install -g heroku

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

## 📱 Screenshots

*Add your screenshots here*

## 🚀 Live Demo

*Add your deployed app links here*

---

⭐ If this project helped you, please give it a star!
