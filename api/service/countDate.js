import moment from 'moment';

// 根据月数计算月数Date的差值
const monDura = months => {
  return moment.duration({ 'months': months });
};

export {
  monDura
};
