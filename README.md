# 💰 Elegant Budget Tracker
<img width="2539" height="1265" alt="Screenshot From 2025-07-12 00-54-14" src="https://github.com/user-attachments/assets/b0ff1f32-f734-4808-8d82-0d09b1733a6b" />

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

## 🏗️ Architecture

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
│   React Build   │      (expencetracker9993)
│                 │
└─────────┬───────┘
          │ HTTPS/HTTP Requests
          ▼
┌─────────────────┐
│   AWS EC2       │  ◄── Backend Server (13.204.100.131)
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
       │ (email/password)                    │ (stored in localStorage)
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
│   │   │       ├── user.ts     # User model
│   │   │       └── transactions.ts # Transaction model
│   │   ├── 📁 middleware/      # Express middleware
│   │   │   └── 📁 jwt/         # JWT authentication
│   │   │       └── authenticateToken.ts # Token verification
│   │   ├── 📁 routes/          # Route handlers (unused in current setup)
│   │   │   ├── auth.ts         # Authentication routes
│   │   │   └── transactions.ts # Transaction routes
│   │   └── 📁 types/           # TypeScript definitions
│   │       └── express.d.ts    # Express type extensions
│   ├── server.ts               # Main server file with all routes
│   ├── ecosystem.config.js     # PM2 process manager configuration
│   ├── package.json            # Dependencies and scripts
│   └── tsconfig.json           # TypeScript configuration
│
├── 📁 Frontend/                # React Vite application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── 📁 Dashboard/   # Dashboard-specific components
│   │   │   │   ├── BalanceSummary.tsx
│   │   │   │   ├── ExpensePieChart.tsx
│   │   │   │   ├── NewTransactionForm.tsx
│   │   │   │   └── TransactionHistory.tsx
│   │   │   ├── 📁 ui/          # Reusable UI components (Radix)
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── 📁 context/         # React Context providers
│   │   │   ├── AuthContext.tsx # localStorage-based auth context
│   │   │   ├── ToastContext.tsx# Toast notifications
│   │   │   └── TransactionContext.tsx # Transaction state
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   │   ├── use-logout.ts   # Enhanced logout with localStorage
│   │   │   ├── use-mobile.tsx  # Mobile detection hook
│   │   │   └── use-toast.ts    # Toast hook
│   │   ├── 📁 lib/             # Utility libraries
│   │   │   ├── axios.ts        # Axios config with Bearer token
│   │   │   └── utils.ts        # Utility functions
│   │   ├── 📁 pages/           # Page components
│   │   │   ├── Dashboard.tsx   # Main dashboard
│   │   │   ├── Index.tsx       # Landing page
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── SignUp.tsx      # Registration page
│   │   │   └── NotFound.tsx    # 404 page
│   │   └── 📁 types/           # TypeScript definitions
│   │       └── index.ts        # Type definitions
│   ├── 📁 public/
│   │   ├── _redirects          # S3/Netlify routing configuration
│   │   ├── favicon.ico
│   │   ├── placeholder.svg
│   │   └── robots.txt
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   ├── components.json         # Shadcn/ui configuration
│   └── package.json            # Dependencies and scripts
│
├── nginx-expense-tracker.conf  # nginx reverse proxy configuration
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

# Create environment file (create .env based on your needs)
touch .env

# Add the following to .env file:
# MONGODB_URI=mongodb://localhost:27017/budget-tracker
# JWT_SECRET=your-super-secret-jwt-key-here
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd Frontend

# Install dependencies
npm install

# Create environment file (create .env based on your needs)
touch .env

# Add the following to .env file:
# VITE_BACKEND_URL=http://localhost:5000
```

### 4. Start the Application

```bash
# Terminal 1 - Start Backend
cd Backend
npm run dev:server

# Terminal 2 - Start Frontend
cd Frontend
npm run dev
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Root**: http://localhost:5000/ (returns "API SERVER IS READY!")

## 🔧 Environment Variables

### Backend (.env)

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/budget-tracker

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### Backend Production (.env.production)

```env
# Database Configuration
MONGODB_URI=mongodb://your-production-mongodb-uri

# JWT Authentication
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

## 📡 API Endpoints & Usage

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `http://13.204.100.131`

### Content Type
All API requests should include:
```
Content-Type: application/json
```

### Authentication
Protected endpoints require JWT token in header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 🔐 Authentication Endpoints

### 1. Root Endpoint
**GET** `/`

Check if the API server is running.

```bash
curl -X GET http://localhost:5000/
```

**Response:**
```
API SERVER IS READY!
```

---

### 2. User Registration (Signup)
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required)"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "success": true
}
```

**Error Response (400):**
```json
{
  "message": "User with this email already exists",
  "error": "USER_EXISTS"
}
```

---

### 3. User Login
**POST** `/api/auth/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePassword123"
  }'
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": "65f8b4c4d9e7f8a9b0c1d2e3",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "message": "Invalid credentials",
  "error": "INVALID_CREDENTIALS"
}
```

---

### 4. Check Authentication Status
**GET** `/api/auth/check`

Verify if the current JWT token is valid.

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/auth/check \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "65f8b4c4d9e7f8a9b0c1d2e3",
    "name": "John Doe",
    "email": "john.doe@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

---

### 5. User Logout
**POST** `/api/auth/logout`

Logout user (frontend should clear localStorage token).

**Example:**
```bash
curl -X POST http://localhost:5000/api/auth/logout
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 💰 Transaction Endpoints

### 1. Create Transaction
**POST** `/api/transaction/create`

Create a new income or expense transaction.

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "type": "string (required: 'income' or 'expense')",
  "amount": "number (required, positive)",
  "category": "string (required)",
  "description": "string (required)",
  "date": "string (required, valid date format)"
}
```

**Example - Income Transaction:**
```bash
curl -X POST http://localhost:5000/api/transaction/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "income",
    "amount": 5000,
    "category": "Salary",
    "description": "Monthly salary payment",
    "date": "2024-01-15"
  }'
```

**Example - Expense Transaction:**
```bash
curl -X POST http://localhost:5000/api/transaction/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "type": "expense",
    "amount": 1200,
    "category": "Groceries",
    "description": "Weekly grocery shopping",
    "date": "2024-01-16"
  }'
```

**Success Response (201):**
```json
{
  "message": "Transaction created successfully",
  "success": true
}
```

**Error Response (400) - Missing Fields:**
```json
{
  "message": "All fields (userId, amount, description, category, type, date) are required",
  "error": "MISSING_FIELDS"
}
```

**Error Response (400) - Invalid Amount:**
```json
{
  "message": "Amount must be a valid number",
  "error": "INVALID_AMOUNT"
}
```

**Error Response (400) - Invalid Type:**
```json
{
  "message": "Type must be either \"income\" or \"expense\"",
  "error": "INVALID_TYPE"
}
```

**Error Response (400) - Invalid Date:**
```json
{
  "message": "Date must be in a valid format",
  "error": "INVALID_DATE"
}
```

---

### 2. Get All Transactions
**GET** `/api/transactions`

Retrieve all transactions for the authenticated user.

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

**Example:**
```bash
curl -X GET http://localhost:5000/api/transactions \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "message": "Transactions retrieved successfully",
  "success": true,
  "transactions": [
    {
      "id": "65f8b5c4d9e7f8a9b0c1d2e4",
      "type": "income",
      "amount": 5000,
      "category": "Salary",
      "description": "Monthly salary payment",
      "date": "2024-01-15T00:00:00.000Z",
      "userId": "65f8b4c4d9e7f8a9b0c1d2e3",
      "createdAt": "2024-01-15T10:35:00.000Z",
      "updatedAt": "2024-01-15T10:35:00.000Z"
    },
    {
      "id": "65f8b5c4d9e7f8a9b0c1d2e5",
      "type": "expense",
      "amount": 1200,
      "category": "Groceries",
      "description": "Weekly grocery shopping",
      "date": "2024-01-16T00:00:00.000Z",
      "userId": "65f8b4c4d9e7f8a9b0c1d2e3",
      "createdAt": "2024-01-15T10:40:00.000Z",
      "updatedAt": "2024-01-15T10:40:00.000Z"
    }
  ]
}
```

**Error Response (401):**
```json
{
  "message": "User authentication failed",
  "error": "USER_NOT_AUTHENTICATED"
}
```

---

### 3. Update Transaction
**PUT** `/api/transaction/:id`

Update an existing transaction by ID.

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Path Parameters:**
- `id` - Transaction ID (required)

**Request Body (all fields optional):**
```json
{
  "type": "string (optional: 'income' or 'expense')",
  "amount": "number (optional)",
  "category": "string (optional)",
  "description": "string (optional)",
  "date": "string (optional, valid date format)"
}
```

**Example:**
```bash
curl -X PUT http://localhost:5000/api/transaction/65f8b5c4d9e7f8a9b0c1d2e4 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "amount": 5500,
    "description": "Monthly salary payment - updated amount"
  }'
```

**Success Response (200):**
```json
{
  "message": "Transaction updated successfully",
  "success": true,
  "transaction": {
    "id": "65f8b5c4d9e7f8a9b0c1d2e4",
    "type": "income",
    "amount": 5500,
    "category": "Salary",
    "description": "Monthly salary payment - updated amount",
    "date": "2024-01-15T00:00:00.000Z",
    "userId": "65f8b4c4d9e7f8a9b0c1d2e3",
    "createdAt": "2024-01-15T10:35:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Response (400) - Transaction Not Found:**
```json
{
  "message": "Transaction not found or access denied",
  "error": "TRANSACTION_NOT_FOUND"
}
```

**Error Response (401):**
```json
{
  "message": "User authentication failed",
  "error": "USER_NOT_AUTHENTICATED"
}
```

---

### 4. Delete Transaction
**DELETE** `/api/transaction/:id`

Delete a transaction by ID.

**Headers Required:**
```
Authorization: Bearer <your-jwt-token>
```

**Path Parameters:**
- `id` - Transaction ID (required)

**Example:**
```bash
curl -X DELETE http://localhost:5000/api/transaction/65f8b5c4d9e7f8a9b0c1d2e4 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Success Response (200):**
```json
{
  "message": "Transaction deleted successfully",
  "success": true
}
```

**Error Response (400) - Transaction Not Found:**
```json
{
  "message": "Transaction not found or access denied",
  "error": "TRANSACTION_NOT_FOUND"
}
```

**Error Response (401):**
```json
{
  "message": "User authentication failed",
  "error": "USER_NOT_AUTHENTICATED"
}
```

---

## 🧪 Testing API Endpoints

### Automated Testing Script

We've provided a comprehensive testing script that tests all API endpoints with proper error handling and colored output. The script is located at `test-api-endpoints.sh` in the project root.

**To run the automated tests:**

```bash
# Make sure your backend server is running
cd Backend
npm run dev

# In another terminal, run the test script
cd /path/to/elegant-budget-tracker
chmod +x test-api-endpoints.sh
./test-api-endpoints.sh
```

The script will:
- ✅ Test all 9 API endpoints
- ✅ Handle authentication flow automatically
- ✅ Test error scenarios and edge cases
- ✅ Provide colored output for easy reading
- ✅ Generate detailed test results summary
- ✅ Work without external dependencies (no jq required)

### Manual Testing Examples

For manual testing or integration with other tools, here are individual curl commands:

#### Authentication Flow Test
```bash
BASE_URL="http://localhost:5000"

# 1. Test server status
curl -X GET $BASE_URL/

# 2. Register new user
curl -X POST $BASE_URL/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# 3. Login and get token
curl -X POST $BASE_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123"
  }'

# Extract token and use it in subsequent requests
TOKEN="your_jwt_token_here"

# 4. Check authentication
curl -X GET $BASE_URL/api/auth/check \
  -H "Authorization: Bearer $TOKEN"

# 5. Create income transaction
curl -X POST $BASE_URL/api/transaction/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "type": "income",
    "amount": 5000,
    "category": "Salary",
    "description": "Monthly salary",
    "date": "2024-01-15"
  }'

# 6. Get all transactions
curl -X GET $BASE_URL/api/transactions \
  -H "Authorization: Bearer $TOKEN"

# 7. Test logout
curl -X POST $BASE_URL/api/auth/logout
```

### Error Testing Examples

```bash
# Test missing authentication
curl -X GET http://localhost:5000/api/transactions

# Test invalid credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "wrong@example.com",
    "password": "wrongpassword"
  }'

# Test invalid transaction data
curl -X POST http://localhost:5000/api/transaction/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "type": "invalid_type",
    "amount": "not_a_number",
    "category": "",
    "description": "",
    "date": "invalid_date"
  }'
```

## 🌐 Current Deployment

### Production URLs
- **Frontend**: http://expencetracker9993.s3-website.ap-south-1.amazonaws.com
- **Backend**: http://13.204.100.131 (via nginx reverse proxy)
- **API Base**: http://13.204.100.131/api

### Production Testing
```bash
# Test production API
curl -X GET http://13.204.100.131/

# Test CORS configuration
curl -H "Origin: http://expencetracker9993.s3-website.ap-south-1.amazonaws.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type,Authorization" \
     -X OPTIONS http://13.204.100.131/api/auth/login
```

## 🛠️ Built With

### Backend Technologies
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Minimal and flexible web application framework
- **TypeScript** - Type safety for backend development
- **MongoDB** - NoSQL document database
- **Mongoose** - MongoDB ODM with schema validation
- **JWT (jsonwebtoken)** - Stateless authentication tokens
- **bcrypt** - Password hashing for security
- **CORS** - Cross-origin resource sharing middleware

### Frontend Technologies
- **React 18** - Modern UI library with hooks and context
- **TypeScript** - Type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible headless UI components
- **React Hook Form** - Performant form management
- **Recharts** - Responsive chart library for data visualization
- **Axios** - HTTP client with interceptors for JWT authentication
- **React Router** - Client-side routing with protected routes

### DevOps & Infrastructure
- **nginx** - High-performance reverse proxy and load balancer
- **PM2** - Advanced production process manager for Node.js
- **AWS S3** - Static website hosting for frontend
- **AWS EC2** - Virtual server for backend hosting

## 🚢 Deployment

### nginx Configuration
```nginx
server {
    listen 80;
    server_name 13.204.100.131;

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

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### PM2 Deployment
```bash
# Start the application
cd Backend
pm2 start ecosystem.config.js --env production

# Monitor the application
pm2 logs
pm2 status
```

## 🚨 Troubleshooting

### Common API Errors

| Status Code | Error | Description | Solution |
|-------------|--------|-------------|----------|
| 400 | MISSING_FIELDS | Required fields not provided | Check request body contains all required fields |
| 400 | INVALID_AMOUNT | Amount is not a valid number | Ensure amount is a positive number |
| 400 | INVALID_TYPE | Transaction type invalid | Use only 'income' or 'expense' |
| 400 | INVALID_DATE | Date format invalid | Use valid date format (YYYY-MM-DD) |
| 401 | USER_NOT_AUTHENTICATED | Missing or invalid JWT token | Include valid Authorization header |
| 401 | INVALID_CREDENTIALS | Wrong email/password | Check login credentials |
| 404 | TRANSACTION_NOT_FOUND | Transaction doesn't exist | Verify transaction ID and ownership |
| 500 | SERVER_ERROR | Internal server error | Check server logs and database connection |

### Debug Commands
```bash
# Check backend logs
pm2 logs

# Test database connection
mongo mongodb://localhost:27017/budget-tracker

# Check if backend is running
curl -X GET http://localhost:5000/

# Verify JWT token (decode)
# Use jwt.io to decode and verify token structure
```

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Rohit** - [GitHub Profile](https://github.com/rohitTo95)

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>🚀 Deployed on AWS with enterprise-grade architecture</p>
  <p>Made with ❤️ by Rohit</p>
</div>
