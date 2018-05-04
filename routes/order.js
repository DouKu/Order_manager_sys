'use strict';
import {
  addOrder,
  markOrder,
  checkMyBill,
  checkMyOrder,
  listOrder,
  orderDetail
} from '../api/controller/order';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 生成订单
  authRouter.post('/order', addOrder);
  // 修改订单状态
  authRouter.put('/order/:orderId', markOrder);
  // 查询当前用户的下单
  authRouter.post('/order/checkOrder', checkMyOrder);
  // 查询当前用户的订单
  authRouter.post('/order/checkBill', checkMyBill);
  // 订单列表
  managerRouter.post('/order/list', listOrder);
  // 订单详情
  managerRouter.get('/order/:orderId', orderDetail);
};
