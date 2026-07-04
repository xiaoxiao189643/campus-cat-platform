// db.js
const mysql = require('mysql2');

// 创建数据库连接池
const pool = mysql.createPool({
    host: 'localhost',      // 数据库地址
    user: 'root',           // 数据库用户名
    password: 'Aabcd2001',    // 【一定要改这里！！！】
    database: 'campus_cat_db', // 数据库名
    port:3307,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 导出这个连接
module.exports = pool.promise();