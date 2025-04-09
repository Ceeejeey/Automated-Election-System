const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

// MongoDB connection URL from environment variables
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        // Connecting to MongoDB
        await mongoose.connect(mongoURI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB;
