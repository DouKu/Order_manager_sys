import '../../config/nconf';
import '../../config/mongoose';
import schedule from 'node-schedule';
import daySummary from './daySummary';
import monthSummary from './monthSummary';
import yearSummary from './yearSummary';
import deleteVcode from './deleteVcode';
import restart from './restart';

console.log('schedule running....');
// 每天0点0分0秒重新生成日度统计表
schedule.scheduleJob('0 0 0 * * *', daySummary);

// 每月1号凌晨3点30分重新生成月度统计表
schedule.scheduleJob('0 0 0 1 * *', monthSummary);

// 每年一号凌晨0点生成年度统计表
schedule.scheduleJob('0 0 0 1 1', yearSummary);

// 每半小时删除验证码
schedule.scheduleJob('0 30 * * * *', deleteVcode);

// 12个小时重启又双叒美订单系统
schedule.scheduleJob('0 0 1 * * *', restart);

schedule.scheduleJob('0 0 13 * * *', restart);
