const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
    clientIp: { type: String, default: "Unknown" },
    userAgent: { type: String, default: "Unknown" },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Log', logSchema);