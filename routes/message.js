'use strict';
import {
  getUnReadMess,
  getAllMess,
  readMess,
  messDetail,
  readAll
} from '../api/controller/message';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取未读消息
  authRouter.get('/mess', getUnReadMess);
  // 获取全部消息
  authRouter.post('/messAll', getAllMess);
  // 消息详情
  authRouter.get('/mess/:messId', messDetail);
  // 读消息
  authRouter.put('/mess/:messId', readMess);
  // 全部已读
  authRouter.get('/messClean', readAll);
};
