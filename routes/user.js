'use strict';
import {
  login,
  register,
  getUserInfo,
  lockUser,
  listUser
} from '../api/controller/user';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 登录
  commonRouter.post('/login', login);
  // 注册
  commonRouter.post('/register', register);
  // 获取当前用户信息
  authRouter.get('/user', getUserInfo);
  // 封号（解封）
  managerRouter.put('/user/:userId', lockUser);
  // 用户列表
  managerRouter.post('/user/list', listUser);
  // 修改密码
  // commonRouter.post('/changePassword', UserController.changePassword)
};
