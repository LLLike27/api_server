/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */
const db = require("../db/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");
// 注册用户的处理函数
exports.regUser = (req, res) => {
  const userInfo = req.body;
  if (!userInfo.username || !userInfo.password) {
    return res.send({ status: 1, message: "用户名或密码不能为空！" });
  }

  const sqlStr = `select * from ev_users where username= ?`;
  db.query(sqlStr, [userInfo.username], (err, results) => {
    //执行sql语句
    if (err) {
      return res.cc(err);
    }
    // 用户名已被注册
    if (results.length > 0) {
      return res.cc("用户名被占用，请更换其他用户名！");
    }
    // 后续操作 用加密存储密码 bcryptjs
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);
    const sql = "insert into ev_users set ?";
    db.query(
      sql,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        if (err) {
          return res.cc(err);
        }
        if (results.affectedRows !== 1) {
          return res.cc("注册用户失败，请稍后再试！");
        }
        res.cc("注册用户成功", 0);
      }
    );
  });
};

// 登录的处理函数
exports.login = (req, res) => {
  const userInfo = req.body;
  const sql = "select * from ev_users where username = ?";
  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err.message);
    // 执行 SQL 语句成功，但是查询到数据条数不等于 1
    if (results.length !== 1) return res.cc("登录失败");
    // 判断密码是否一致
    // 核心实现思路：调用 bcrypt.compareSync(用户提交的密码, 数据库中的密码) 方法比较密码是否一致
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    if (!compareResult) {
      return res.cc("密码错误");
    }

    // TODO：在服务器端生成 Token 的字符串
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = { ...results[0], password: "", user_pic: "" };
    // console.log(user);
    // 常见token
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn,
    });

    res.send({
      status: 0,
      message: "登录成功！",
      token: tokenStr,
    });
  });
};
