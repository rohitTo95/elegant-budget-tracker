# 💰 Elegant Budget Tracker

<div align="center">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<div align="center">
  <h3>A modern, full-stack budget tracking application built with TypeScript</h3>
  <p>Track your income and expenses with style and ease</p>
</div>

---

## 🌟 Features

- ✨ **Modern UI**: Beautiful, responsive design with Tailwind CSS and Radix UI components
- 🔐 **Secure Authentication**: JWT-based authentication with HTTP-only cookies
- 📊 **Transaction Management**: Create, read, update, and delete transactions
- 📈 **Visual Analytics**: Interactive charts and financial summaries
- 🏗️ **Type-Safe**: Built entirely with TypeScript for better developer experience
- 🚀 **Production Ready**: Includes Docker support and CI/CD pipeline
- 📱 **Mobile Responsive**: Works perfectly on all device sizes

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   React Frontend│◄───┤   Express API   │◄───┤   MongoDB       │
│   (Vite + TS)   │    │   (Node.js)     │    │   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    Port 3000               Port 5000              Default Port
         │                       │                       │
         │                       │                       │
    ┌─────────┐            ┌─────────┐            ┌─────────┐
    │ Tailwind│            │   JWT   │            │Mongoose │
    │   CSS   │            │  Auth   │            │   ODM   │
    │ Radix UI│            │ Cookie  │            │ Models  │
    └─────────┘            └─────────┘            └─────────┘
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
│   │   │   └── 📁 jwt/         # JWT authentication
│   │   └── 📁 types/           # TypeScript definitions
│   ├── server.ts               # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── 📁 Frontend/                # React Vite application
│   ├── 📁 src/
│   │   ├── 📁 components/      # React components
│   │   │   ├── 📁 Dashboard/   # Dashboard-specific components
│   │   │   └── 📁 ui/          # Reusable UI components
│   │   ├── 📁 context/         # React Context providers
│   │   ├── 📁 hooks/           # Custom React hooks
│   │   ├── 📁 lib/             # Utility libraries
│   │   ├── 📁 pages/           # Page components
│   │   └── 📁 types/           # TypeScript definitions
│   ├── vite.config.ts          # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS configuration
│   └── package.json
│
├── 📁 .github/workflows/       # CI/CD pipelines
└── README.md                   # This file
```

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Install locally](https://docs.mongodb.com/manual/installation/) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download here](https://git-scm.com/)

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
# - VITE_API_URL=http://localhost:5000
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

**Option B: Using the deployment script**

```bash
# Make the script executable
chmod +x test-deployment.sh

# Run the deployment script
./test-deployment.sh
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

# CORS
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000
```

## 📡 API Endpoints

### Authentication
- `POST /api/user/signup` - Register a new user
- `POST /api/user/login` - Login user
- `GET /api/auth/check` - Check authentication status

### Transactions
- `GET /api/transactions` - Get user's transactions
- `POST /api/transaction/create` - Create a new transaction
- `PUT /api/transaction/:id` - Update a transaction
- `DELETE /api/transaction/:id` - Delete a transaction

### Health Check
- `GET /health` - Server health status
- `GET /api/health` - API health status

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
```

## 🐳 Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in production mode
docker-compose -f docker-compose.prod.yml up
```

## 🚢 Deployment

### AWS EC2 Deployment

The project includes GitHub Actions workflows for automatic deployment:

1. **Backend Deployment**: `.github/workflows/deploy-backend.yml`
2. **Frontend Deployment**: `.github/workflows/deploy-frontend.yml`

Required GitHub Secrets:
- `EC2_HOST` - Your EC2 instance IP
- `EC2_USER` - EC2 username (usually 'ubuntu')
- `EC2_SSH_KEY` - Your private SSH key

### Manual Deployment

```bash
# Production build
cd Backend && npm run build
cd Frontend && npm run build

# Start production server
cd Backend && npm start
```

## 🛠️ Built With

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible UI components
- **React Hook Form** - Form management
- **Recharts** - Chart library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### DevOps
- **GitHub Actions** - CI/CD
- **PM2** - Process manager
- **ESLint** - Code linting
- **Prettier** - Code formatting

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

### Authentication
- 🔐 Secure user registration
- 🔑 JWT-based authentication
- 🍪 HTTP-only cookie storage
- 🛡️ Protected routes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Rohit** - [GitHub Profile](https://github.com/rohitTo95)

## 🙏 Acknowledgments

- Thanks to all contributors who have helped this project grow
- Inspired by modern budgeting applications
- Built with love for the open-source community

---

<div align="center">
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>Made with ❤️ by Rohit</p>
</div>
