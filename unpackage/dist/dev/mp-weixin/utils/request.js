"use strict";
const common_vendor = require("../common/vendor.js");
const BASE_URL = "http://localhost:3000/api";
class Request {
  constructor() {
    this.baseURL = BASE_URL;
  }
  request(method, url, data = {}) {
    return new Promise((resolve, reject) => {
      const token = common_vendor.index.getStorageSync("token");
      const header = {
        "Content-Type": "application/json"
      };
      if (token) {
        header["Authorization"] = `Bearer ${token}`;
      }
      common_vendor.index.request({
        url: this.baseURL + url,
        method,
        data,
        header,
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            if (res.data.success) {
              resolve(res.data);
            } else {
              reject(new Error(res.data.message || "请求失败"));
            }
          } else if (res.statusCode === 401) {
            this.handleUnauthorized();
            reject(new Error("登录已过期，请重新登录"));
          } else {
            reject(new Error(`请求失败: ${res.statusCode}`));
          }
        },
        fail: (err) => {
          reject(new Error("网络请求失败，请检查网络连接"));
        }
      });
    });
  }
  get(url, data = {}) {
    return this.request("GET", url, data);
  }
  post(url, data = {}) {
    return this.request("POST", url, data);
  }
  handleUnauthorized() {
    common_vendor.index.removeStorageSync("token");
    common_vendor.index.removeStorageSync("userInfo");
    common_vendor.index.showToast({
      title: "登录已过期，请重新登录",
      icon: "none"
    });
    setTimeout(() => {
      common_vendor.index.reLaunch({
        url: "/pages/login/login"
      });
    }, 1500);
  }
}
const request = new Request();
exports.request = request;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
