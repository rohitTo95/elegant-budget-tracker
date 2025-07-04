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
  // Try to get token from Authorization header first, then from cookies
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
  
  // If no token in header, try to get it from cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log('Token found in cookies');
  } else if (token) {
    console.log('Token found in Authorization header');
  }

  if (!token) {
    console.log('No token found in request');
    res.status(401).json({
      message: 'Access token required',
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
      message: 'Invalid or expired token',
      error: 'INVALID_TOKEN'
    });
    return;
  }
};