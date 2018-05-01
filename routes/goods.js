import {
  addGoods,
  getGoods,
  getAllGoods,
  deleteGoods,
  updatedMess
} from '../api/controller/goods';

module.exports = (router, authRouter, commonRouter) => {
  // 添加商品
  authRouter.post('/goods', addGoods);
  authRouter.get('/goods', getGoods);
  authRouter.get('/goods/all', getAllGoods);
  authRouter.delete('/goods/:goodsId', deleteGoods);
  authRouter.put('/goods/:goodsId', updatedMess);
};
