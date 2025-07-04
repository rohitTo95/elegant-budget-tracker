import User, { type User as UserType } from '../database/models/user';
import bcrypt from 'bcrypt';

export interface SignupResult {
    success: boolean;
    message: string;
    error?: string;
}

export interface LoginResult {
    success: boolean;
    message: string;
    user?: UserType;
    error?: string;
}

export const signupUser = async (name: string, email: string, password: string): Promise<SignupResult> => {
    try {
        // Validate input
        if (!name || !email || !password) {
            return {
                success: false,
                message: 'All fields (name, email, password) are required',
                error: 'MISSING_FIELDS'
            };
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return {
                success: false,
                message: 'User with this email already exists',
                error: 'USER_EXISTS'
            };
        }

        // Hash the password
        const saltRounds = 12;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name,
            email,
            passwordHash
        });
        
        await newUser.save();
        
        return {
            success: true,
            message: 'User created successfully'
        };
    } catch (error: any) {
        console.error('Error creating user:', error);
        
        // Handle MongoDB duplicate key error
        if (error.code === 11000) {
            return {
                success: false,
                message: 'User with this email already exists',
                error: 'DUPLICATE_EMAIL'
            };
        }
        
        // Handle validation errors
        if (error.name === 'ValidationError') {
            return {
                success: false,
                message: 'Invalid user data provided',
                error: 'VALIDATION_ERROR'
            };
        }
        
        return {
            success: false,
            message: 'Internal server error occurred',
            error: 'SERVER_ERROR'
        };
    }
}

export const loginUser = async (email: string, password: string): Promise<LoginResult> => {
    try {
        // Validate input
        if (!email || !password) {
            return {
                success: false,
                message: 'Email and password are required',
                error: 'MISSING_FIELDS'
            };
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: 'Please provide a valid email address',
                error: 'INVALID_EMAIL'
            };
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return {
                success: false,
                message: 'Invalid email or password',
                error: 'INVALID_CREDENTIALS'
            };
        }
        
        // Compare password with hashed password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            return {
                success: false,
                message: 'Invalid email or password',
                error: 'INVALID_CREDENTIALS'
            };
        }
        
        return {
            success: true,
            message: 'Login successful',
            user: user
        };
    } catch (error: any) {
        console.error('Error logging in user:', error);
        
        return {
            success: false,
            message: 'An error occurred during login',
            error: 'SERVER_ERROR'
        };
    }
}