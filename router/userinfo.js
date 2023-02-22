const express = require("express");
const router = express.Router();

// 导入路由处理函数模块
const userinfoHandler = require("../router_handler/userinfo");
// 导入需要的验证规则对象
const {
  update_userinfo_schema,
  update_password_schema,
  update_avatar_schema,
} = require("../schema/user");
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入需要的验证规则对象

// 获取用户基本信息的路由
router.get("/userinfo", userinfoHandler.getUserInfo);
// 更新用户信息的路由
router.post(
  "/userinfo",
  expressJoi(update_userinfo_schema),
  userinfoHandler.updateUserInfo
);
// 重置密码
router.post(
  "/updatepwd",
  expressJoi(update_password_schema),
  userinfoHandler.updatePassword
);
// 更新用户头像
router.post(
  "/update/avatar",
  expressJoi(update_avatar_schema),
  userinfoHandler.updateAvatar
);
module.exports = router;
