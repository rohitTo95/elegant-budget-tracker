# Elegant Budget Tracker
![thumbnail](./public/assets/landingPage-42916e4b-c69f-4071-81f9-80818228d5ed)
## 🗂️ Description

The Elegant Budget Tracker is a full-stack application designed to help users manage their finances effectively. It allows users to track their income and expenses, view detailed reports, and make informed decisions about their financial health. This project is ideal for individuals seeking a simple yet powerful tool to monitor and control their spending.

The application consists of a robust backend built with Node.js, Express.js, and MongoDB, ensuring secure and efficient data management. The frontend is developed with React, Vite, and Tailwind CSS, providing a responsive and user-friendly interface.

## ✨ Key Features

### **User Authentication**
- Secure user registration and login functionality
- JSON Web Tokens (JWT) for authentication and authorization

### **Transaction Management**
- Create, read, update, and delete transactions
- Categorize transactions (income/expense)
- View detailed transaction history

### **Financial Insights**
- Visualize financial data with pie charts and summaries
- Track total income, total expenses, and net balance

### **Responsive Design**
- Mobile-friendly interface for on-the-go access
- Adaptable layout for various screen sizes

## 🗂️ Folder Structure

```mermaid
graph TD;
  src-->backend;
  src-->frontend;
  backend-->src/database;
  backend-->src/api;
  backend-->src/routes;
  frontend-->src/components;
  frontend-->src/context;
  frontend-->src/pages;
```

## 🛠️ Tech Stack

![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white&style=for-the-badge)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white&style=for-the-badge)
![Vite](https://img.shields.io/badge/Vite-6461E1?logo=vite&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white&style=for-the-badge)

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or remote)

### Steps to Run the Project

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rohitTo95/elegant-budget-tracker.git
   ```
2. **Navigate to the Project Directory**
   ```bash
   cd elegant-budget-tracker
   ```
3. **Install Dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```
4. **Start the Backend Server**
   ```bash
   cd backend
   npm run start
   ```
   or
   ```bash
   cd backend
   yarn start
   ```
5. **Start the Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   or
   ```bash
   cd frontend
   yarn dev
   ```
6. **Access the Application**
   - Frontend: [http://localhost:5173](http://localhost:5173)
   - Backend API: [http://localhost:3000](http://localhost:3000)

## 🚀 GitHub Actions

The project utilizes GitHub Actions for automated deployment and testing.

### **Deploy Frontend**
- Workflow file: `.github/workflows/deploy-frontend.yml`
- Triggers on push events to the main branch
- Deploys the frontend to an S3 bucket

### **Deploy Backend**
- Workflow file: `.github/workflows/deploy-backend.yml`
- Triggers on push events to the main branch
- Deploys the backend to an EC2 instance

## 🤝 Code Quality and Security

- **ESLint**: Configured for both frontend and backend to ensure code quality and consistency.
- **TypeScript**: Used throughout the project for type safety and maintainability.
- **Secure Dependencies**: Regularly updated to prevent vulnerabilities.



<br><br>
<div align="center">
<img src="https://avatars.githubusercontent.com/u/91669680?v=4" width="120" />
<h3>Rohit Dutta</h3>
<p>No information provided.</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    