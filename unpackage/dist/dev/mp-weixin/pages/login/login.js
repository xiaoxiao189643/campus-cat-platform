"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      username: "",
      // 改为用户名
      password: "",
      showPassword: false,
      loading: false
    };
  },
  computed: {
    // 判断是否可以登录（用户名和密码都已填写）
    canLogin() {
      return this.username.length > 0 && this.password.length >= 6;
    }
  },
  methods: {
    // 切换密码显示/隐藏
    togglePassword() {
      this.showPassword = !this.showPassword;
    },
    // 处理用户名密码登录
    async handleLogin() {
      if (this.loading)
        return;
      if (!this.username) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      if (this.password.length < 6) {
        common_vendor.index.showToast({
          title: "密码至少6位",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      this.loading = true;
      try {
        const loginRes = await this.$api.login({
          username: this.username,
          password: this.password
        });
        if (loginRes.success && loginRes.data) {
          const userInfo = {
            userId: loginRes.data.userId,
            username: loginRes.data.username
          };
          common_vendor.index.setStorageSync("token", loginRes.data.token);
          common_vendor.index.setStorageSync("userInfo", userInfo);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/index/index"
            });
          }, 1500);
        } else {
          throw new Error(loginRes.message || "登录失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:173", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.loading = false;
      }
    },
    // 处理微信登录
    async handleWechatLogin() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({
            provider: "weixin",
            success: resolve,
            fail: reject
          });
        });
        if (!loginRes.code) {
          throw new Error("获取微信授权码失败");
        }
        common_vendor.index.__f__("log", "at pages/login/login.vue:205", "获取到微信code:", loginRes.code);
        const tokenRes = await this.$api.wechatLogin({
          code: loginRes.code
        });
        if (tokenRes.success && tokenRes.data) {
          const userInfo = {
            userId: tokenRes.data.userId,
            isNewUser: tokenRes.data.isNewUser
          };
          common_vendor.index.setStorageSync("token", tokenRes.data.token);
          common_vendor.index.setStorageSync("userInfo", userInfo);
          common_vendor.index.showToast({
            title: "登录成功",
            icon: "success",
            duration: 1500
          });
          if (tokenRes.data.isNewUser) {
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/complete-info/complete-info"
              });
            }, 1500);
          } else {
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/index/index"
              });
            }, 1500);
          }
        } else {
          throw new Error(tokenRes.message || "登录失败");
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:249", "微信登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请重试",
          icon: "none",
          duration: 3e3
        });
      } finally {
        this.loading = false;
      }
    },
    // 跳转到注册页面
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    }
  }
};
if (!Array) {
  const _component_activity_indicator = common_vendor.resolveComponent("activity-indicator");
  _component_activity_indicator();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: $data.username,
    c: common_vendor.o(($event) => $data.username = $event.detail.value),
    d: $data.showPassword ? "text" : "password",
    e: $data.password,
    f: common_vendor.o(($event) => $data.password = $event.detail.value),
    g: common_vendor.t($data.showPassword ? "👁️" : "👁️‍🗨️"),
    h: common_vendor.o((...args) => $options.togglePassword && $options.togglePassword(...args)),
    i: common_vendor.t($data.loading ? "登录中..." : "登录"),
    j: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    k: $data.loading || !$options.canLogin,
    l: common_vendor.t($data.loading ? "登录中..." : "微信一键登录"),
    m: common_vendor.o((...args) => $options.handleWechatLogin && $options.handleWechatLogin(...args)),
    n: $data.loading,
    o: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args)),
    p: $data.loading
  }, $data.loading ? {
    q: common_vendor.p({
      size: "large",
      color: "#07C160"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
