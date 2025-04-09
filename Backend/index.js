const express = require('express');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
