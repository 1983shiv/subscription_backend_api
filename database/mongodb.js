import mongoose from 'mongoose';
import { DB_URI, NODE_ENV } from "../config/env.js";

// let DB_URI = 'mongodb://localhost:27017/subscription-tracker'; // Replace with your connection string if needed

if (!DB_URI) {
    console.error('MongoDB URI is required');
    // throw new Error('Please define the MONGODB URI environment variable');
    process.exit(1);
}


async function connectToDatabase(){
    console.log(`Connecting to MongoDB ${DB_URI} in ${NODE_ENV} mode`);
    try {   
        await mongoose.connect(DB_URI);
        // console.log(`Connected to MongoDB in ${NODE_ENV} mode`);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`);
        process.exit(1);
    }
};

export default connectToDatabase;
