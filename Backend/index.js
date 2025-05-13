const express = require('express');
const app = express();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const electionRoutes = require('./routes/electionRoutes')
const candidateRoutes = require('./routes/candidateRoutes');
const voteRoutes = require('./routes/voteRoutes');
const resultRoutes = require('./routes/resultRoutes'); // Uncomment if you have a result route
const adminRoutes = require('./routes/adminRoutes');
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
app.use('/api', electionRoutes);
app.use('/api', candidateRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api', resultRoutes); // Uncomment if you have a result route

app.use('/api/admin', adminRoutes);


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
