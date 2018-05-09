import '../../config/nconf';
import '../../config/mongoose';
import schedule from 'node-schedule';
import daySummary from './daySummary';

console.log('schedule running....');
// 每天0点0分0秒重新生成日度统计表
schedule.scheduleJob('0 0 0 * * *', daySummary);

// 每月1号凌晨3点30分重新生成月度统计表
