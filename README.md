# 校园流浪猫互助平台

基于 **UniApp**（微信小程序）和 **Node.js + Express + MongoDB** 开发的校园流浪猫救助与社区互动平台。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | UniApp (Vue 2/3 双版本兼容) |
| 目标平台 | 微信小程序 (`mp-weixin`) |
| 后端框架 | Express 5.x |
| 数据库 | MongoDB (`campus_cat_db`) |
| 文件上传 | multer |
| 认证方式 | JWT (Bearer Token) |
| 开发工具 | HBuilderX / VS Code + 微信开发者工具 |

---

## 快速开始

### 1. 环境准备

- Node.js 18+
- MongoDB
- HBuilderX 或 uni-app CLI
- 微信开发者工具

### 2. 后端启动

```bash
cd server

# 首次运行需创建 .env 并安装依赖
cp .env.example .env          # 根据需要修改环境变量
npm install

npm run dev                    # nodemon 热重载，默认端口 3000
```

> 数据库连接配置见 `server/db.js`，默认连接本地 MongoDB 的 `campus_cat_db` 数据库。

### 3. 前端运行

```bash
# 安装依赖
npm install

# 编译到微信小程序
npm run dev:mp-weixin
```

编译产物在 `unpackage/dist/dev/mp-weixin/`，用微信开发者工具打开该目录预览。

---

## 项目结构

```
campus-cat-platform/
├── main.js                  # UniApp 入口（Vue 2/3 条件编译）
├── App.vue                  # 应用壳（生命周期）
├── pages.json               # 页面路由注册
├── uni.scss                 # UniApp 主题 SCSS 变量
├── manifest.json            # 应用配置（appid 等）
├── index.html               # H5 入口模板
│
├── pages/                   # 已实现的页面
│   ├── login/login.vue      # 登录页（用户名密码 / 微信登录）
│   └── index/index.vue      # 首页（骨架）
│
├── api/
│   └── index.js             # 接口方法定义
│
├── utils/
│   └── request.js           # uni.request 封装（自动 token、401 处理）
│
├── static/                  # 静态资源
│   └── logo.png
│
├── client/                  # 【规划中】前端分包结构
│   ├── components/          # 公共组件
│   ├── pages/               # 业务页面
│   ├── static/              # 静态资源
│   ├── stores/              # 状态管理
│   └── utils/               # 工具函数
│
├── server/                  # 后端
│   ├── app.js               # Express 应用配置入口
│   ├── server.js            # 服务器启动
│   ├── db.js                # MongoDB 连接
│   ├── routes/              # 路由（已实现）
│   │   ├── community.js     # 社区帖子/评论
│   │   ├── donation.js      # 物资捐献
│   │   └── upload.js        # 文件上传
│   ├── controllers/         # 【规划中】控制器
│   ├── models/              # 【规划中】数据模型
│   ├── middleware/           # 【规划中】中间件
│   ├── config/              # 【规划中】配置
│   ├── uploads/             # 上传文件存储目录
│   └── .env.example         # 环境变量模板
│
└── unpackage/               # 编译产物（勿手动修改）
    └── dist/dev/mp-weixin/
```

---

## 功能规划与进度

### 普通用户端

| 模块 | 说明 | 状态 |
|------|------|------|
| 登录 / 注册 | 用户名密码登录 + 微信一键登录 | ✅ 已实现 |
| 首页 | 校园猫咪地图、搜索、功能宫格 | 🔨 骨架完成 |
| 流浪猫信息上报 | 拍照上传 + 地图选点 | 📋 规划中 |
| 救助需求申请 | 猫咪选择、紧急度、伤情描述 | 📋 规划中 |
| 猫粮急救箱 | 物资捐献互助 | 📋 规划中 |
| 交流大厅 | 帖子发布/评论/点赞 | 🔨 后端 API 已就绪 |
| 猫咪档案 | 档案列表/详情/关注/投喂/领养 | 📋 规划中 |
| 个人中心 | 申请记录/投喂记录/关注/设置 | 📋 规划中 |

### 管理员端

| 模块 | 说明 | 状态 |
|------|------|------|
| 控制台 | 审核/通知/档案/任务 入口 | 📋 规划中 |
| 审核中心 | 捐献/救助/领养审核 | 📋 规划中 |
| 档案管理 | 猫咪信息编辑 | 📋 规划中 |
| 通知模块 | 站内公告发布 | 📋 规划中 |
| 任务中心 | 救助任务发布 | 📋 规划中 |
| 用户管理 | 用户列表、权限管理 | 📋 规划中 |

---

## API 接口文档

基础地址：`http://localhost:3000`

### 认证

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/register` | 用户注册 |
| POST | `/api/login` | 用户名密码登录 |
| POST | `/api/wechat/login` | 微信登录（传入 code） |

### 社区 (`/api/community`)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/community/posts` | 获取帖子列表（按时间倒序） |
| POST | `/api/community/posts` | 发布帖子 |
| POST | `/api/community/posts/like` | 点赞帖子（`{ postId }`） |
| POST | `/api/community/posts/delete` | 删除帖子（`{ postId }`） |
| GET | `/api/community/comments?postId=1` | 获取帖子评论 |
| POST | `/api/community/comments` | 发表评论（`{ postId, content, userId }`） |

**帖子字段**：`id`, `content`, `user_id`, `type` (daily/...), `images` (JSON 数组), `likes`, `created_at`

### 捐献 (`/api/donation`)

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/donation` | 查看捐献记录列表 |
| POST | `/api/donation` | 提交捐献（`{ itemName, quantity, userId }`） |

### 文件上传 (`/api/upload`)

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/upload` | 上传图片（`multipart/form-data`，字段名 `file`） |

> ⚠️ 上传接口当前运行在端口 3003，与其他接口的 3000 不一致，需要统一。

### 响应格式

```json
// 成功
{ "code": 200, "msg": "操作成功", "data": { ... } }

// 失败（HTTP 错误状态码）
{ "msg": "错误描述" }
```

> ⚠️ 前端 `utils/request.js` 检查的是 `res.data.success`，与后端返回的 `code` 字段不一致，后续新增接口需统一。

---

## 开发规范

1. **分支策略**：各自在功能分支开发，通过 Pull Request 合并到 `dev` 分支
2. **前后端字段对齐**：响应使用统一的 `code` 或 `success` 字段，避免混用
3. **端口规范**：所有 API 统一端口，避免上传接口单独使用 3003 的情况
4. **数据库操作**：统一通过 `server/db.js` 连接 MongoDB，避免直连
