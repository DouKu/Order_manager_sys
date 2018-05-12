import {
  applyCode,
  verifyCode
} from '../api/controller/verificataionCode';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 获取短信验证码
  commonRouter.get('/vcode', applyCode);
  // 验证短信验证码
  commonRouter.post('/vcode', verifyCode);
};
