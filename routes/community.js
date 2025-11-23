const express = require('express');
const router = express.Router();
const db = require('../db'); // 注意：这里多了两个点，因为要退回上一级找 db.js

// 接口 A: 获取帖子列表
router.get('/api/posts', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM posts ORDER BY id DESC');
        res.json({ code: 200, msg: '获取成功', data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '查询出错' });
    }
});

// 接口 B: 发布帖子 (支持图片)
router.post('/api/posts', async (req, res) => {
    try {
        const { content, userId, type, images } = req.body; 
        if (!content) return res.status(400).json({ msg: '内容不能为空' });

        const imagesStr = images ? JSON.stringify(images) : '[]';
        const sql = 'INSERT INTO posts (content, user_id, type, images) VALUES (?, ?, ?, ?)';
        const [result] = await db.execute(sql, [content, userId || 0, type || 'daily', imagesStr]);

        res.json({ code: 200, msg: '发布成功', data: { id: result.insertId } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '发布失败' });
    }
});

// 接口 E: 点赞
router.post('/api/posts/like', async (req, res) => {
    try {
        const { postId } = req.body;
        await db.execute('UPDATE posts SET likes = likes + 1 WHERE id = ?', [postId]);
        res.json({ code: 200, msg: '点赞成功！' });
    } catch (error) {
        res.status(500).json({ msg: '点赞失败' });
    }
});

// 接口 F: 删除
router.post('/api/posts/delete', async (req, res) => {
    try {
        const { postId } = req.body;
        await db.execute('DELETE FROM posts WHERE id = ?', [postId]);
        res.json({ code: 200, msg: '删除成功' });
    } catch (error) {
        res.status(500).json({ msg: '删除失败' });
    }
});

// --- 接口 G: 发表评论 (增) ---
router.post('/api/comments', async (req, res) => {
    try {
        // 前端必须传：postId (给谁评), content (评什么), userId (谁评的)
        const { postId, content, userId } = req.body;

        if (!postId || !content) {
            return res.status(400).json({ msg: '参数不完整' });
        }

        const sql = 'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)';
        await db.execute(sql, [postId, userId || 0, content]);

        res.json({ code: 200, msg: '评论成功' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: '评论失败' });
    }
});

// --- 接口 H: 获取某篇帖子的评论列表 (查) ---
// 用法: GET http://localhost:3003/api/comments?postId=1
router.get('/api/comments', async (req, res) => {
    try {
        const { postId } = req.query; // 从网址问号后面拿 postId

        if (!postId) {
            return res.status(400).json({ msg: '请指定要查看哪篇帖子的评论' });
        }

        // 按时间正序排（旧的在上面，新的在下面）
        const sql = 'SELECT * FROM comments WHERE post_id = ? ORDER BY id ASC';
        const [rows] = await db.query(sql, [postId]);

        res.json({ code: 200, data: rows });
    } catch (error) {
        res.status(500).json({ msg: '获取评论失败' });
    }
});


module.exports = router; // 把这个路由器导出，给 app.js 用