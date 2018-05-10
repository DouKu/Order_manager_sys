import moment from 'moment';

// 根据月数计算月数Date的差值
const monDura = months => {
  return moment.duration({ 'months': months });
};

// 根据时间戳获取当天0点与第二天0点
const getdate = (date = Date.now()) => {
  const dayBegin = moment(date).format('YYYY-MM-DD');
  return {
    dayBegin: new Date(dayBegin + ' 00:00:00'),
    dayEnd: new Date(dayBegin + ' 23:59:59')
  };
};

// 根据当前时间获取当月1号0点0时0分0秒与本月最后一日号23点59分59秒
const getMonth = (date = Date.now()) => {
  const monthBegin = moment(date).format('YYYY-MM');
  const days = moment(date).daysInMonth();
  return {
    monthBegin: new Date(monthBegin + '-01 00:00:00'),
    monthEnd: new Date(monthBegin + `-${days} 23:59:59`)
  };
};

// 根据时间获取年份1号0点0时0分0秒与本年最后一日 23点59分59秒
const getYear = (date = Date.now()) => {
  const year = moment(date).format('YYYY');
  return {
    yearBegin: new Date(year + '-01-01 00:00:00'),
    yearEnd: new Date(year + '-12-31 23:59:59')
  };
};

export {
  monDura,
  getdate,
  getMonth,
  getYear
};
