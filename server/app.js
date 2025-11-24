/**
 * server/app.js
 * 校园猫猫平台后端主应用入口文件
 */

// --- 1. 引入依赖和配置 ---
const express = require('express');
const cors = require('cors');
const path = require('path');
// 加载环境变量
require('dotenv').config();

// --- 2. 引入自定义路由 ---
const communityRoutes = require('./routes/community');
const donationRoutes = require('./routes/donation');

// --- 3. 初始化应用 ---
const app = express();

// --- 4. 配置全局中间件 ---
// 允许跨域请求
app.use(cors());
// 解析 JSON 格式请求体
app.use(express.json());
// 解析 URL-encoded 格式请求体
app.use(express.urlencoded({ extended: true }));

// --- 5. 配置静态文件服务 ---
// 访问 /uploads 路径时，提供 server/uploads 目录下的文件
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 6. 注册 API 路由 ---
// 社区功能路由组，前缀 /api/community
app.use('/api/community', communityRoutes);
// 捐赠功能路由组，前缀 /api/donation
app.use('/api/donation', donationRoutes);

// --- 7. 基础路由和错误处理 ---
// 根路由健康检查
app.get('/', (req, res) => {
    res.json({
        message: '校园猫猫平台后端 API 服务运行中',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// 404 处理 (捕获所有未匹配的路由)
app.use((req, res) => {
    res.status(404).json({
        error: '接口不存在',
        path: req.originalUrl
    });
});

// --- 8. 启动服务器 ---
const PORT = process.env.PORT || 3000; // 优先使用环境变量端口，否则使用 3000
app.listen(PORT, () => {
    console.log(`---------------------------------------`);
    console.log(` 🚀 后端服务已启动! `);
    console.log(` 📡 运行在端口: ${PORT}`);
    console.log(`---------------------------------------`);
});

// 导出 app 实例 (便于测试或被其他文件引用)
module.exports = app;