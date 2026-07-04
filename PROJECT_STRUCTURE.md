# 校园流浪猫互助平台 - 项目结构

## 目录说明

### 前端项目 (client/)
基于 UniApp 开发，负责微信小程序界面

#### 主要页面：
- `client/pages/index/` - 首页地图 (前端A)
- `client/pages/login/` - 登录页 (前端B)  
- `client/pages/report/` - 信息上报 (前端C)
- `client/pages/rescue/` - 救助申请 (前端C)
- `client/pages/community/` - 交流大厅 (前端D)
- `client/pages/cats/` - 猫咪档案 (前端D)
- `client/pages/profile/` - 个人中心 (前端B)
- `client/pages/admin/audit/` - 审核中心 (前端E)
- `client/pages/admin/cats/` - 猫咪管理 (前端F)
- `client/pages/admin/users/` - 用户管理 (前端F)

### 后端项目 (server/)
基于 Node.js 开发，提供 API 接口

#### 主要模块：
- `server/controllers/` - 业务逻辑控制器
- `server/models/` - 数据模型
- `server/routes/` - API 路由
- `server/middleware/` - 中间件
- `server/config/` - 配置文件

## 开发规范
1. 每个人在自己的功能分支上开发
2. 完成功能后通过 Pull Request 合并到 dev 分支
3. 保持代码风格统一
