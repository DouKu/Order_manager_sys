'use strict';
import { getUploadToken, upload } from '../api/controller/qiniu';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取上传凭证
  authRouter.get('/uploadToken', getUploadToken);
  // 上传文件
  authRouter.post('/upload', upload);
};
