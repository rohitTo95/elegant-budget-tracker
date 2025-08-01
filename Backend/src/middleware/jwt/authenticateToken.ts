import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

interface JWTPayload {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
  iat?: number;
  exp?: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from Authorization header only (Bearer TOKEN)
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (token) {
    console.log('Token found in Authorization header');
  }

  // Check if token exists and is not empty
  if (!token || token.trim() === '') {
    console.log('Authentication failed: No token provided');
    res.status(401).json({
      message: 'Access token required - please login',
      error: 'NO_TOKEN'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JWTPayload;
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      createdAt: decoded.createdAt ? new Date(decoded.createdAt) : new Date(),
      updatedAt: decoded.updatedAt ? new Date(decoded.updatedAt) : new Date()
    };
    console.log('Token verified successfully for user:', decoded.name);
    next();
  } catch (error) {
    console.log('Token verification failed:', error);
    res.status(403).json({
      message: 'Invalid or expired token - please login again',
      error: 'INVALID_TOKEN'
    });
    return;
  }
};