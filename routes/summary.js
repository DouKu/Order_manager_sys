'use strict';
import {
  getDaysSummary,
  getMonthSummary,
  getYearSummary,
  getOwnDaySummary,
  getOwnMonthSummary,
  getOwnYearSummary
} from '../api/controller/summary';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取日度统计数据
  managerRouter.post('/dsummary', getDaysSummary);
  // 获取月度统计数据
  managerRouter.post('/msummary', getMonthSummary);
  // 获取年度统计数据
  managerRouter.post('/ysummary', getYearSummary);
  // 当前用户日度数据
  authRouter.post('/dsummary', getOwnDaySummary);
  // 当前用户月度数据
  authRouter.post('/msummary', getOwnMonthSummary);
  // 当前用户年度数据
  authRouter.post('/ysummary', getOwnYearSummary);
};
