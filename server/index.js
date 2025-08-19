const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: ["https://pritam-exam-portal.vercel.app"], // frontend domain
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // include PATCH here
    allowedHeaders: ["Content-Type", "Authorization"], // include headers if needed
    credentials: true
}));

app.options("*", cors());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// app.listen(3001, () => {
//     console.log("\n\"Server is running on http://127.0.0.1:3001/\"");
// });

module.exports = app;