import {
  addGoods,
  getGoodsByTarget,
  getGoodsByName,
  deleteGoods,
  updatedGoodsPrice,
  updatedGoodsInfo
} from '../api/controller/goods';

module.exports = (router, authRouter, commonRouter) => {
  // 添加商品
  authRouter.post('/goods', addGoods);
  authRouter.get('/goods/target', getGoodsByTarget);
  authRouter.get('/goods/name', getGoodsByName);
  authRouter.delete('/goods', deleteGoods);
  authRouter.post('/goods/update/price', updatedGoodsPrice);
  authRouter.post('/goods/update/info', updatedGoodsInfo);
};
