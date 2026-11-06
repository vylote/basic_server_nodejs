require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require('cors');

const logRoutes = require('./routes/logRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json({ extended: true }));

const port = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || "mongodb://user:Password123@localhost:27017/keylogger_db?authSource=keylogger_db";

mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MongoDB successfully!"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.use('/api', logRoutes);

app.get("/", (req, res) => {
    res.send("<h2>Keylogger Backend API (MongoDB) is running successfully!</h2>");
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});