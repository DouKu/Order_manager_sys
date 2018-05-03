'use strict';
import { showConfigs, changeConifgs } from '../api/controller/config.js';
module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 添加商品
  managerRouter.get('/configs', showConfigs);
  managerRouter.post('/configs', changeConifgs);
};
