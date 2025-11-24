const express = require('express');
const router = express.Router();
const db = require('../db');

// 接口 C: 提交物资
router.post('/api/donations', async (req, res) => {
    try {
        const { itemName, quantity, userId } = req.body;
        if (!itemName || !quantity) return res.status(400).json({ msg: '请填写完整' });

        const sql = 'INSERT INTO donations (item_name, quantity, user_id) VALUES (?, ?, ?)';
        await db.execute(sql, [itemName, quantity, userId || 0]);

        res.json({ code: 200, msg: '捐献成功！' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '提交失败' });
    }
});

// 接口 D: 查看记录
router.get('/api/donations', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM donations ORDER BY id DESC');
        res.json({ code: 200, data: rows });
    } catch (error) {
        res.status(500).json({ msg: '获取失败' });
    }
});

module.exports = router;