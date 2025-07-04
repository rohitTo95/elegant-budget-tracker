import { config } from 'dotenv';
import mongoose from 'mongoose';

config();

const uri = process.env.DATABASE_URL || 'mongodb://localhost:27017';
const dbName = process.env.DATABASE_NAME || 'elegant-budget-tracker';

if (!uri) {
  throw new Error('DATABASE_URL is not defined in the environment variables');
}

interface MongoDBClientOptions {
  serverApi: {
    version: "1";
    strict: boolean;
    deprecationErrors: boolean;
  };
  dbName: string;
}
const clientOptions: MongoDBClientOptions = { 
  serverApi: { version: '1', strict: true, deprecationErrors: true },
  dbName: dbName
};

export const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    
    // Ping to confirm connection
    await mongoose.connection.db?.admin().command({ ping: 1 });
    
    console.log(`✅ Successfully connected to MongoDB!`);
    console.log(`📄 Database: ${mongoose.connection.name}`);
    console.log(`🔗 Host: ${mongoose.connection.host}`);
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    return false;
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error) {
    console.error("❌ Error disconnecting from MongoDB:", error);
  }
};

// Test connection function
export const testConnection = async () => {
  try {
    await connectDB();
    console.log("🧪 Database connection test passed!");
    await disconnectDB();
  } catch (error) {
    console.error("🧪 Database connection test failed:", error);
  }
};
