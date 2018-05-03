'use strict';
import { getUploadToken } from '../api/controller/qiniu';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取上传凭证
  authRouter.get('/uploadToken', getUploadToken);
};
