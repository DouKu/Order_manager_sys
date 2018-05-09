'use strict';
import { getSummaryByDay } from '../api/controller/summary';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取每日统计数据
  managerRouter.post('/dsummary', getSummaryByDay);
};
