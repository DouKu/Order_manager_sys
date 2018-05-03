'use strict';
import {
  getOwnAddress,
  addAddress,
  deleteAddress,
  updateAddress,
  changeDefault
} from '../api/controller/address';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 查看收货地址
  authRouter.get('/address', getOwnAddress);
  // 添加收货地址
  authRouter.post('/address', addAddress);
  // 更新地址某个收货地址
  authRouter.put('/address/:addressId', updateAddress);
  // 删除收货地址
  authRouter.delete('/address/:addressId', deleteAddress);
  // 更改默认地址
  authRouter.put('/address/default/:addressId', changeDefault);
};
