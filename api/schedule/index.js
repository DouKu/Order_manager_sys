import schedule from 'node-schedule';
import daySummary from './daySummary';

// 每天3点30分30秒重新生成日度统计表
schedule.scheduledJobs('0 0 0 * * *', daySummary);

// 每月1号凌晨3点30分重新生成月度统计表
