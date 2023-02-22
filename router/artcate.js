const express = require("express");
const router = express.Router();
// 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 导入文章分类的验证模块
const {
  add_cate_schema,
  delete_cate_schema,
  get_cate_schema,
  update_cate_schema,
} = require("../schema/artcate");

const artcateHandler = require("../router_handler/artcate");

// 获取文章分类列表数据的路由
router.get("/cates", artcateHandler.getArticleCates);
// 新增文章分类的路由
router.post(
  "/addcates",
  expressJoi(add_cate_schema),
  artcateHandler.addArticleCates
);
// 根据 Id 删除文章分类的路由
router.get(
  "/deletecates/:id",
  expressJoi(delete_cate_schema),
  artcateHandler.deleteArticleCates
);
// 根据 Id 获取文章分类的路由
router.get(
  "/cates/:id",
  expressJoi(get_cate_schema),
  artcateHandler.getArtCateById
);
// 更新文章分类的路由
router.post(
  "/updatecate",
  expressJoi(update_cate_schema),
  artcateHandler.updateCateById
);

module.exports = router;
