'use strict';
import {
  addGoods,
  getGoods,
  getAllGoods,
  deleteGoods,
  updatedMess,
  checkProfit
} from '../api/controller/goods';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 添加商品
  managerRouter.post('/goods', addGoods);
  // web端获取商品
  authRouter.get('/goods', getGoods);
  // 后台管理获取商品
  managerRouter.get('/goods/all', getAllGoods);
  // 删除商品
  managerRouter.delete('/goods/:goodsId', deleteGoods);
  // 修改商品信息
  managerRouter.put('/goods/:goodsId', updatedMess);
  // 查看差价利润
  authRouter.get('/goods/profit', checkProfit);
};
