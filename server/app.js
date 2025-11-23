const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 导入路由
const catRoutes = require('./routes/cats');
const mapRoutes = require('./routes/map');
const uploadRoutes = require('./routes/upload');

// 导入中间件
const errorHandler = require('./middleware/errorHandler');
const logger = require('./middleware/logger');

const app = express();

// 中间件
app.use(logger);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由配置
app.use('/api/cats', catRoutes);
app.use('/api/map', mapRoutes);
app.use('/api/upload', uploadRoutes);

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: '校园猫猫平台后端API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 错误处理中间件
app.use(errorHandler);

module.exports = app;