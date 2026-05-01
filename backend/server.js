require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const historyRoutes = require('./routes/historyRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Connect to Database
connectDB();

// Basic Routes
app.get('/ping', (req, res) => {
    res.json({ status: 'ok', time: new Date(), message: 'Loan Intelligence Engine is reachable' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/history', historyRoutes);
app.use('/api', loanRoutes); // For /api/calculate

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`🚀 Intelligent Loan Engine running on http://localhost:${PORT}`);
});