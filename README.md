# 💰 Elegant Budget Tracker

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
  <img src="https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" />
</div>

<div align="center">
  <h3>A modern, production-ready budget tracking application built with TypeScript</h3>
  <p>Track your income and expenses with enterprise-grade architecture and security</p>
</div>

---

## 🌟 Features

- ✨ **Modern UI**: Beautiful, responsive design with Tailwind CSS and Radix UI components
- 🔐 **Secure Authentication**: JWT-based authentication with localStorage token storage (no CORS issues)
- 📊 **Transaction Management**: Full CRUD operations for financial transactions
- 📈 **Visual Analytics**: Interactive charts and comprehensive financial summaries
- 🏗️ **Type-Safe**: Built entirely with TypeScript for better developer experience
- 🚀 **Production Ready**: Enterprise-grade deployment with nginx reverse proxy
- 📱 **Mobile Responsive**: Progressive Web App design for all device sizes
- 🌐 **Cross-Origin Optimized**: localStorage-based auth eliminates cookie CORS issues
- ⚡ **High Performance**: nginx load balancing and optimized API endpoints
- 🔒 **Security Focused**: JWT tokens, password hashing, and secure headers
- 📦 **CI/CD Pipeline**: Automated testing and deployment workflows
- 🐳 **Docker Support**: Containerized deployment for scalability

## 🏗️ Production Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄───┤   Express API   │◄───┤   MongoDB       │
│   (Vite + TS)   │    │   (Node.js)     │    │   Database      │
│   localhost:3000│    │  localhost:5000 │    │   Port 27017    │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment (AWS)
```
    Internet
        │
        ▼
┌─────────────────┐
│   AWS S3 Bucket │  ◄── Static Frontend Hosting
│   React Build   │      (S3 Website Endpoint)
│                 │
└─────────┬───────┘
          │ HTTPS/HTTP Requests
          ▼
┌─────────────────┐
│   AWS EC2       │
│   Ubuntu Server │
│                 │
│  ┌─────────────┐│
│  │   nginx     ││  ◄── Reverse Proxy & Load Balancer
│  │   Port 80   ││      CORS Handler & Static Assets
│  └──────┬──────┘│
│         │       │
│  ┌──────▼──────┐│
│  │  Node.js    ││  ◄── Express API Server
│  │  Port 5000  ││      JWT Authentication
│  │  PM2 Managed││      Business Logic
│  └──────┬──────┘│
└─────────┼───────┘
          │
          ▼
┌─────────────────┐
│   MongoDB       │  ◄── Database Server
│   Atlas/Local   │      User Data & Transactions
│   Port 27017    │      Mongoose ODM
└─────────────────┘
```

### Authentication Flow (localStorage-based)
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │    │             │
│  S3 Frontend│───▶│   nginx     │───▶│ Express API │───▶│  MongoDB    │
│             │    │ (Port 80)   │    │(Port 5000)  │    │             │
│             │    │             │    │             │    │             │
└──────┬──────┘    └─────────────┘    └──────┬──────┘    └─────────────┘
       │                                     │
       │ 1. Login Request                    │ 2. JWT Token Response
       │ (username/password)                 │ (stored in localStorage)
       │                                     │
       │ 3. Subsequent Requests              │
       │ Authorization: Bearer <token>       │
       └─────────────────────────────────────┘
```

## 📁 Project Structure

```
elegant-budget-tracker/
├── 📁 Backend/                 # Node.js Express API
│   ├── 📁 src/
│   │   ├── 📁 api/             # Business logic
│   │   │   ├── user.ts         # User authentication logic
│   │   │   └── transaction.ts  # Transaction CRUD operations
│   │   ├── 📁 database/        # Database configuration
│   │   │   ├── db_connect.ts   # MongoDB connection
│   │   │   └── 📁 models/      # Mongoose schemas
│   │   ├── 📁 middleware/      # Express middleware
│   │   │   └── 📁 jwt/         # JWT authentication (localStorage-based)
│   │   ├── 📁 routes/          # API route handlers
│   │   │   ├── auth.ts         # Authentication endpoints
│   │   │   └── transactions.ts # Transaction endpoints
│   │   └── 📁 types/           # TypeScript definitions
│   ├── server.ts               # Main server file with CORS config
│   ├── ecosystem.config.js     # PM2 process manager configuration
│   ├── .env.production         # Production environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 Frontend/                # React Vite application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── 📁 Dashboard/   # Dashboard-specific components
│   │   │   └── 📁 ui/          # Reusable UI components (Radix)
│   │   ├── 📁 context/         # React Context providers
│   │   │   ├── AuthContext.tsx # localStorage-based auth context
│   │   │   ├── ToastContext.tsx# Toast notifications
│   │   │   └── TransactionContext.tsx # Transaction state
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   │   ├── use-logout.ts   # Enhanced logout with localStorage
│   │   │   └── use-toast.ts    # Toast hook
│   │   ├── 📁 lib/             # Utility libraries
│   │   │   ├── axios.ts        # Axios config with Bearer token
│   │   │   └── utils.ts        # Utility functions
│   │   ├── 📁 pages/           # Page components
│   │   └── 📁 types/           # TypeScript definitions
│   ├── 📁 public/
│   │   ├── _redirects          # Netlify/S3 routing configuration
│   │   └── favicon.ico
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── .env.production         # Production API endpoints
│   └── package.json
│
├── 📁 .github/workflows/       # CI/CD pipelines
│   ├── deploy-backend.yml      # Backend deployment to EC2
│   └── deploy-frontend.yml     # Frontend deployment to S3
│
├── nginx-expense-tracker.conf  # nginx reverse proxy configuration
├── fix-cors-deployment.sh      # CORS deployment script
├── test-localStorage-auth.sh   # Authentication testing script
├── AUTHENTICATION_MIGRATION.md # Cookie to localStorage migration guide
├── CORS_FIX_SUMMARY.md        # CORS troubleshooting guide
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)
- **nginx** (for production) - [Install guide](https://nginx.org/en/docs/install.html)

### 1. Clone the Repository

```bash
git clone https://github.com/rohitTo95/elegant-budget-tracker.git
cd elegant-budget-tracker
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# Required variables:
# - MONGODB_URI=mongodb://localhost:27017/budget-tracker
# - JWT_SECRET=your-secret-key
# - PORT=5000
# - NODE_ENV=development
# - FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd Frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit the .env file with your configuration
# Required variables:
# - VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start the Application

**Option A: Start both servers separately**

```bash
# Terminal 1 - Start Backend
cd Backend
npm run dev:server

# Terminal 2 - Start Frontend
cd Frontend
npm run dev
```

**Option B: Using the test script**

```bash
# Make the script executable
chmod +x test-localStorage-auth.sh

# Run the authentication test script
./test-localStorage-auth.sh
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🔧 Environment Variables

### Backend (.env)

```env
# Database
MONGODB_URI=mongodb://localhost:27017/budget-tracker

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Backend Production (.env.production)

```env
# Database
MONGODB_URI=mongodb://your-production-mongodb-uri

# Authentication
JWT_SECRET=your-production-jwt-secret

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration (AWS S3 Frontend)
FRONTEND_URL=http://expencetracker9993.s3-website.ap-south-1.amazonaws.com
```

### Frontend (.env)

```env
# API Configuration (Development)
VITE_BACKEND_URL=http://localhost:5000
```

### Frontend Production (.env.production)

```env
# API Configuration (Production via nginx)
VITE_BACKEND_URL=http://13.204.100.131
```

## 📡 API Endpoints

### Authentication (localStorage-based JWT)
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user (returns JWT token for localStorage storage)
- `POST /api/auth/logout` - Logout user (frontend clears localStorage)
- `GET /api/auth/check` - Check authentication status (requires Bearer token)

### Transactions
- `GET /api/transactions` - Get user's transactions (requires authentication)
- `POST /api/transaction/create` - Create a new transaction (requires authentication)
- `PUT /api/transaction/:id` - Update a transaction (requires authentication)
- `DELETE /api/transaction/:id` - Delete a transaction (requires authentication)

### Health Check
- `GET /health` - Server health status
- `GET /api/health` - API health status

### Request Headers
All authenticated requests must include:
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

### Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "token": "jwt-token-here" // Only in login response
}
```

## 🌐 Current Deployment

### Production URLs (Updated)
- **Frontend**: http://expencetracker9993.s3-website.ap-south-1.amazonaws.com
- **Backend**: http://13.204.100.131 (via nginx reverse proxy)
- **API Base**: http://13.204.100.131/api
- **Health Check**: http://13.204.100.131/health

### Architecture Summary
- **Frontend**: React build deployed on AWS S3 static hosting
- **Backend**: Node.js Express server on AWS EC2 Ubuntu instance
- **Proxy**: nginx reverse proxy handling CORS and routing
- **Database**: MongoDB (Atlas or local instance)
- **Authentication**: JWT tokens stored in localStorage (no cookie CORS issues)

## 🧪 Testing

```bash
# Run backend tests
cd Backend
npm test

# Run frontend tests
cd Frontend
npm test

# Run linting
npm run lint

# Test authentication flow
chmod +x test-localStorage-auth.sh
./test-localStorage-auth.sh

# Test CORS configuration
curl -H "Origin: http://expencetracker9993.s3-website.ap-south-1.amazonaws.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With,Content-Type,Authorization" \
     -X OPTIONS http://13.204.100.131/api/auth/login
```

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up
```

## 🚢 Deployment

### Production Architecture

The application is designed for a cloud-native architecture:

- **Frontend**: AWS S3 Static Website Hosting
- **Backend**: AWS EC2 with nginx reverse proxy
- **Database**: MongoDB Atlas or EC2-hosted MongoDB
- **Load Balancer**: nginx (handles CORS, SSL termination, static assets)

### nginx Configuration

The project includes a production-ready nginx configuration (`nginx-expense-tracker.conf`):

```nginx
server {
    listen 80;
    server_name 13.204.100.131;

    # Proxy API requests to Node.js backend
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoints
    location /health {
        proxy_pass http://localhost:5000;
        # ... additional proxy headers
    }
}
```

### AWS EC2 Deployment

1. **Deploy nginx configuration:**
```bash
# Copy nginx config to server
sudo cp nginx-expense-tracker.conf /etc/nginx/sites-available/expense-tracker
sudo ln -s /etc/nginx/sites-available/expense-tracker /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

2. **Deploy backend application:**
```bash
# Use the deployment script
chmod +x fix-cors-deployment.sh
./fix-cors-deployment.sh
```

3. **Process Management with PM2:**
```bash
# Start application with PM2
cd Backend
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### AWS S3 Frontend Deployment

```bash
# Build frontend for production
cd Frontend
npm run build

# Deploy to S3 (using AWS CLI)
aws s3 sync dist/ s3://expencetracker9993 --delete
aws s3 website s3://expencetracker9993 --index-document index.html --error-document index.html
```

### GitHub Actions CI/CD

The project includes automated deployment workflows:

1. **Backend Deployment**: `.github/workflows/deploy-backend.yml`
2. **Frontend Deployment**: `.github/workflows/deploy-frontend.yml`

Required GitHub Secrets:
- `EC2_HOST` - Your EC2 instance IP (e.g., 13.204.100.131)
- `EC2_USER` - EC2 username (usually 'ubuntu')
- `EC2_SSH_KEY` - Your private SSH key
- `AWS_ACCESS_KEY_ID` - AWS access key for S3 deployment
- `AWS_SECRET_ACCESS_KEY` - AWS secret key for S3 deployment

### Manual Production Deployment

```bash
# Build both applications
cd Backend && npm run build
cd ../Frontend && npm run build

# Start production backend
cd Backend
NODE_ENV=production npm start

# Or use PM2
pm2 start ecosystem.config.js --env production
```

### Environment-Specific Configurations

- **Development**: Direct API calls to `localhost:5000`
- **Production**: API calls through nginx reverse proxy on port 80
- **CORS**: Configured for S3 to EC2 communication
- **Authentication**: localStorage-based JWT (no cookie CORS issues)

## 🛠️ Built With

### Frontend
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible headless UI components
- **React Hook Form** - Performant form management
- **Recharts** - Responsive chart library for data visualization
- **Axios** - HTTP client with interceptors for JWT authentication
- **React Router** - Client-side routing with protected routes

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Minimal and flexible web application framework
- **TypeScript** - Type safety for backend development
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB ODM with schema validation
- **JWT (jsonwebtoken)** - Stateless authentication tokens
- **bcrypt** - Password hashing for security
- **CORS** - Cross-origin resource sharing middleware
- **Helmet** - Security middleware for Express

### DevOps & Infrastructure
- **nginx** - High-performance reverse proxy and load balancer
- **PM2** - Advanced production process manager for Node.js
- **GitHub Actions** - CI/CD pipeline automation
- **AWS S3** - Static website hosting for frontend
- **AWS EC2** - Virtual server for backend hosting
- **Docker** - Containerization (optional)
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting

### Development Tools
- **Vite** - Fast HMR and optimized builds
- **TypeScript Compiler** - Type checking and compilation
- **Concurrently** - Run multiple npm scripts simultaneously
- **Nodemon** - Automatic server restart during development

## 📈 Features Overview

### Dashboard
- 📊 Visual expense breakdown with pie charts
- 💰 Real-time balance calculation
- 📅 Transaction history with filtering
- ➕ Quick transaction entry

### Transaction Management
- ✅ Add income and expense transactions
- 🏷️ Categorize transactions
- 📝 Add descriptions and notes
- 📅 Date tracking
- ✏️ Edit and delete transactions

### Authentication & Security
- 🔐 **JWT-based Authentication**: Stateless authentication using JSON Web Tokens
- 💾 **localStorage Token Storage**: No cookie-related CORS issues in production
- 🔒 **Password Security**: bcrypt hashing with salt rounds
- 🛡️ **Protected Routes**: Client-side and server-side route protection
- 🌐 **CORS Optimization**: Proper cross-origin configuration for S3-to-EC2 communication
- 📱 **Token Refresh**: Automatic token validation and logout on expiry

### Performance & Scalability
- ⚡ **nginx Reverse Proxy**: Load balancing and request optimization
- 🚀 **PM2 Process Management**: Zero-downtime deployments and clustering
- 📦 **Code Splitting**: Optimized bundle sizes with Vite
- 🎯 **Lazy Loading**: Route-based code splitting for faster initial loads
- 💾 **Efficient State Management**: React Context with optimized re-renders

### Production Features
- 🔄 **Zero-Downtime Deployment**: PM2 graceful restarts
- 📊 **Health Monitoring**: Built-in health check endpoints
- 🚨 **Error Handling**: Comprehensive error boundaries and logging
- 🔍 **Request Logging**: Detailed API request tracking
- 🛡️ **Security Headers**: Helmet.js security middleware

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors in Production
If you encounter CORS issues when deploying:

1. **Check nginx configuration**:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

2. **Verify backend CORS settings**:
   - Ensure `FRONTEND_URL` in `.env.production` matches your S3 website URL
   - Confirm `credentials: false` in CORS configuration

3. **Test CORS preflight**:
```bash
curl -H "Origin: http://expencetracker9993.s3-website.ap-south-1.amazonaws.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS http://13.204.100.131/api/auth/login
```

#### Authentication Issues
1. **Check localStorage**: Verify JWT token is stored in browser localStorage
2. **Token Format**: Ensure requests include `Authorization: Bearer <token>` header
3. **Token Expiry**: Check browser console for 401/403 errors

#### Deployment Issues
1. **PM2 Process**: Check if backend is running with `pm2 status`
2. **nginx Status**: Verify nginx is running with `sudo systemctl status nginx`
3. **Port Conflicts**: Ensure port 5000 is available for Node.js

### Debug Commands

```bash
# Check backend logs
pm2 logs expense-tracker

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Test API endpoints
curl -X GET http://localhost:5000/health
curl -X GET http://13.204.100.131/api/health

# Check process status
pm2 status
sudo systemctl status nginx
```

## 📚 Migration Guides

The project includes comprehensive migration documentation:

- **`AUTHENTICATION_MIGRATION.md`**: Complete guide for migrating from cookie-based to localStorage-based authentication
- **`CORS_FIX_SUMMARY.md`**: Solutions for common CORS issues in production
- **`MIGRATION_COMPLETE.md`**: Summary of completed migration changes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript strict mode conventions
- Use ESLint and Prettier for code formatting
- Write tests for new features
- Update documentation for API changes
- Ensure CORS compatibility for production deployment

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit** - [GitHub Profile](https://github.com/rohitTo95)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped this project grow
- Inspired by modern budgeting applications and enterprise architecture patterns
- Built with love for the open-source community
- Special thanks to the React, Node.js, and nginx communities

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>🚀 Deployed on AWS with enterprise-grade architecture</p>
  <p>Made with ❤️ by Rohit</p>
</div>
