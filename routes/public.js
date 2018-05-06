'use strict';
import {
  getPublics,
  addPublic,
  deletePublic,
  updatePublic
} from '../api/controller/public';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 查看公有素材
  authRouter.get('/public', getPublics);
  // 添加共有素材
  managerRouter.post('/public', addPublic);
  // 修改素材信息
  managerRouter.put('/public/:publicId', updatePublic);
  // 删除
  managerRouter.delete('/public/:publicId', deletePublic);
};
