const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const authenticateToken = require('../middleware/authMiddleware');

router.post('/calculate', authenticateToken, loanController.calculateLoan);

module.exports = router;
