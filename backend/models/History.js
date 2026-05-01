const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
    userId: { type: String, required: true },
    income: Number,
    existingEmi: Number,
    requestedAmount: Number,
    tenure: Number,
    creditScore: Number,
    latePayments: Number,
    hasCreditMix: Boolean,
    jobTenure: Number,
    netTakeHomePay: Number,
    downPayment: Number,
    assetValue: Number,
    age: Number,
    residencyType: String,
    employmentType: String,
    status: String,
    requiredEmi: Number,
    maxEmiAllowed: Number,
    maxEligibleAmount: Number,
    emiForMaxAmount: Number,
    riskLevel: String,
    riskReasons: [String],
    interestRate: Number,
    ltv: Number,
    foirUsed: Number,
    totalInterest: Number,
    totalRepayment: Number,
    schedule: Array,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', HistorySchema);
