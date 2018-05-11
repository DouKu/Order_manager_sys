import '../../config/nconf';
import '../../config/mongoose';
import schedule from 'node-schedule';
import daySummary from './daySummary';
import monthSummary from './monthSummary';
import yearSummary from './yearSummary';

console.log('schedule running....');
// 每天0点0分0秒重新生成日度统计表
schedule.scheduleJob('0 0 0 * * *', daySummary);

// 每月1号凌晨3点30分重新生成月度统计表
schedule.scheduleJob('0 0 0 1 * *', monthSummary);

// 每年一号凌晨0点生成年度统计表
schedule.scheduleJob('0 0 0 1 1', yearSummary);
