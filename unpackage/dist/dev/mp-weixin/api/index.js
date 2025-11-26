"use strict";
const utils_request = require("../utils/request.js");
const api = {
  // 用户注册
  register(data) {
    return utils_request.request.post("/register", data);
  },
  // 用户登录
  login(data) {
    return utils_request.request.post("/login", data);
  },
  // 微信登录
  wechatLogin(data) {
    return utils_request.request.post("/wechat/login", data);
  },
  // 获取受保护资源
  getProtectedResource() {
    return utils_request.request.get("/protected-resource");
  }
};
exports.api = api;
//# sourceMappingURL=../../.sourcemap/mp-weixin/api/index.js.map
