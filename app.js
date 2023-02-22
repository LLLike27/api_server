// 导入 express 模块
const express = require("express");
// 创建 express 的服务器实例
const app = express();
const Joi = require("joi");
const port = 3000;
const config = require("./config");
// 解析 token 的中间件
const { expressjwt } = require("express-jwt");

// 配置跨域中间件
const cors = require("cors");
// 将 cors() 注册为全局中间件
app.use(cors());

// 配置解析表单数据的中间件，注意：这个中间件，只能解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }));

// 响应数据的中间件
app.use(function (req, res, next) {
  // status = 0 为成功； status = 1 为失败； 默认将 status 的值设置为 1，方便处理失败的情况
  res.cc = function (err, status = 1) {
    res.send({
      // 状态
      status,
      // 状态描述，判断 err 是 错误对象 还是 字符串
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});
app.use(
  expressjwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/api/], // unless非排除路径  意思经过/api/都需要解密
  })
);
// 导入并注册用户路由模块
const userRouter = require("./router/user");
app.use("/api", userRouter);

// 导入并注册用户信息路由模块
const userinfoRouter = require("./router/userinfo");
app.use("/my", userinfoRouter);

// 导入并注册文章分类管理路由模块
const artcateRouter = require("./router/artcate");
app.use("/my/article", artcateRouter);

// 导入并使用文章路由模块
const articleRouter = require("./router/article");
// 为文章的路由挂载统一的访问前缀 /my/article
app.use("/my/article", articleRouter);

// 全局的错误级别中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof Joi.ValidationError) return res.cc(err);
  // 身份认证失败后的错误
  // console.log(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！");
  // 未知的错误
  res.cc(err);
});
// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(port, function () {
  console.log(`api server running at http://127.0.0.1:${port}`);
});
