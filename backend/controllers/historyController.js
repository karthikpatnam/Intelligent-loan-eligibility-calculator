const History = require('../models/History');

exports.getHistory = async (req, res) => {
    try {
        const userHistory = await History.find({ userId: req.user.id }).sort({ timestamp: -1 });
        res.json(userHistory);
    } catch (err) {
        res.status(500).json({ message: "Error fetching history." });
    }
};

exports.saveHistory = async (req, res) => {
    try {
        const entry = new History({
            ...req.body,
            userId: req.user.id
        });
        await entry.save();
        console.log(`[HISTORY] Saved entry for ${req.user.email}`);
        res.status(201).json(entry);
    } catch (err) {
        console.error('[HISTORY ERROR]', err);
        res.status(500).json({ message: "Error saving history.", details: err.message });
    }
};
