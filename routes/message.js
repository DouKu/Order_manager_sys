'use strict';
import { getUnReadMess, getAllMess, readMess } from '../api/controller/message';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取未读消息
  authRouter.get('/mess', getUnReadMess);
  // 获取全部消息
  authRouter.get('/messAll', getAllMess);
  // 读消息
  authRouter.get('/mess/:messId', readMess);
};
