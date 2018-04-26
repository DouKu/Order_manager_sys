import { addGoods } from '../api/controller/goods';

module.exports = (router, authRouter, commonRouter) => {
  // 添加商品
  authRouter.post('/goods', addGoods);
};
