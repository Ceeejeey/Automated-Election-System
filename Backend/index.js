const express = require('express');
const connectDB = require('./config/db');  // Import the connectDB function

const app = express();
const PORT = 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse incoming JSON requests
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
