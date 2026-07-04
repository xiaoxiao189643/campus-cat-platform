const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// 配置 Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// 接口 G: 上传图片
router.post('/api/upload', upload.single('file'), (req, res) => {
    try {
        const file = req.file;
        if (!file) return res.status(400).json({ msg: '请选择图片' });
        
        // 注意：这里要把 localhost:3003 硬编码进去，或者以后改成动态获取
        const fileUrl = `http://localhost:3003/uploads/${file.filename}`;
        res.json({ code: 200, msg: '上传成功', url: fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '上传失败' });
    }
});

module.exports = router;