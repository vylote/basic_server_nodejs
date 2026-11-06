const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

// Endpoint lấy danh sách log có phân trang & lọc: GET /api/logs
router.get('/logs', logController.getLogs);

// Endpoint nhận log từ Python client: POST /api/logs (hoặc giữ nguyên POST / tùy bạn chọn)
router.post('/logs', logController.createLog);

module.exports = router;