// app.js - 变得非常干净了！
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3003;

// 1. 基础中间件
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // 公开图片文件夹

// 2. 引入路由文件 (模块化)
const communityRoutes = require('./routes/community');
const donationRoutes = require('./routes/donation');
const uploadRoutes = require('./routes/upload');

// 3. 使用路由
app.use(communityRoutes);
app.use(donationRoutes);
app.use(uploadRoutes);

// 4. 简单测试接口
app.get('/', (req, res) => {
    res.send('后端 C 服务运行中 (已重构)');
});

// 5. 启动
app.listen(PORT, () => {
    console.log(`---------------------------------------`);
    console.log(` 🚀 后端 C 服务已启动 (模块化版)! `);
    console.log(` 📡 地址: http://localhost:${PORT}`);
    console.log(`---------------------------------------`);
});