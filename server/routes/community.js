// server/routes/community.js
// 社区功能路由模块
const express = require('express');
const router = express.Router();
const db = require('../db');

// --- 接口 A: 获取帖子列表 (查) ---
// 最终访问地址: GET http://localhost:3000/api/community/posts
router.get('/posts', async (req, res) => {
    try {
        // 按 ID 倒序排列，最新的在最前面
        const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
        res.json({ code: 200, msg: '获取成功', data: rows });
    } catch (error) {
        console.error('获取帖子列表失败:', error);
        res.status(500).json({ msg: '查询出错' });
    }
});

// --- 接口 B: 发布帖子 (增) ---
// 最终访问地址: POST http://localhost:3000/api/community/posts
router.post('/posts', async (req, res) => {
    try {
        const { content, userId, type, images } = req.body;
        // 基本校验
        if (!content) return res.status(400).json({ msg: '内容不能为空' });

        // 图片数组转 JSON 字符串存入数据库
        const imagesStr = images ? JSON.stringify(images) : '[]';
        
        const sql = 'INSERT INTO posts (content, user_id, type, images) VALUES (?, ?, ?, ?)';
        // 使用 userId || 0 防止未登录用户报错（根据实际需求调整）
        const [result] = await db.execute(sql, [content, userId || 0, type || 'daily', imagesStr]);

        res.json({ code: 200, msg: '发布成功', data: { id: result.insertId } });
    } catch (error) {
        console.error('发布帖子失败:', error);
        res.status(500).json({ msg: '发布失败' });
    }
});

// --- 接口 C: 点赞 (改) ---
// 最终访问地址: POST http://localhost:3000/api/community/posts/like
router.post('/posts/like', async (req, res) => {
    try {
        const { postId } = req.body;
        // 直接在数据库层面让 likes 字段加 1
        await db.execute('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
        res.json({ code: 200, msg: '点赞成功！' });
    } catch (error) {
        // console.error('点赞失败:', error); // 可以选择记录日志
        res.status(500).json({ msg: '点赞失败' });
    }
});

// --- 接口 D: 删除帖子 (删) ---
// 最终访问地址: POST http://localhost:3000/api/community/posts/delete
router.post('/posts/delete', async (req, res) => {
    try {
        const { postId } = req.body;
        await db.execute('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ code: 200, msg: '删除成功' });
    } catch (error) {
        console.error('删除帖子失败:', error);
        res.status(500).json({ msg: '删除失败' });
    }
});

// --- 接口 E: 发表评论 (增) ---
// 最终访问地址: POST http://localhost:3000/api/community/comments
router.post('/comments', async (req, res) => {
    try {
        const { postId, content, userId } = req.body;
        // 校验必要参数
        if (!postId || !content) {
            return res.status(400).json({ msg: '参数不完整' });
        }
        const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
        await db.execute(sql, [postId, userId || 0, content]);
        res.json({ code: 200, msg: '评论成功' });
    } catch (error) {
        console.error('评论失败:', error);
        res.status(500).json({ msg: '评论失败' });
    }
});

// --- 接口 F: 获取某篇帖子的评论列表 (查) ---
// 最终访问地址: GET http://localhost:3000/api/community/comments?postId=1
router.get('/comments', async (req, res) => {
    try {
        const { postId } = req.query;
        // 校验查询参数
        if (!postId) {
            return res.status(400).json({ msg: '请指定要查看哪篇帖子的评论' });
        }
        // 按 ID 正序排列（旧评论在上面，新评论在下面）
        const sql = 'SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC';
        const [rows] = await db.query(sql, [postId]);
        res.json({ code: 200, data: rows });
    } catch (error) {
        console.error('获取评论失败:', error);
        res.status(500).json({ msg: '获取评论失败' });
    }
});

module.exports = router;