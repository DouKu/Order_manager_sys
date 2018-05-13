'use strict';
import {
  login,
  phoneLogin,
  register,
  changePersionMess,
  activeAccount,
  getUserInfo,
  lockUser,
  getBubordinate,
  listUser,
  newUser,
  levelUp,
  checkLevel,
  checkSubLevel,
  listLevel,
  deelLevelCheck
} from '../api/controller/user';

module.exports = (router, authRouter, commonRouter, managerRouter) => {
  // 登录
  commonRouter.post('/login', login);
  // 电话登录
  commonRouter.post('/plogin', phoneLogin);
  // 注册
  commonRouter.post('/register', register);
  // 修改个人信息
  authRouter.put('/user/:userId', changePersionMess);
  // 激活账号
  authRouter.post('/user/active', activeAccount);
  // 获取当前用户信息
  authRouter.get('/user', getUserInfo);
  // 封号（解封）
  managerRouter.put('/user/:userId', lockUser);
  // 获取下级信息
  authRouter.get('/subUser/:userId', getBubordinate);
  // 用户列表
  managerRouter.post('/user/list', listUser);
  // 添加账号
  managerRouter.post('/user', newUser);
  // 申请提升等级
  authRouter.post('/level', levelUp);
  // 查看我的申请记录
  authRouter.get('/level', checkLevel);
  // 查看下级的申请记录
  authRouter.get('/sublevel', checkSubLevel);
  // 升级请求列表
  managerRouter.post('/level', listLevel);
  // 管理员审核申请
  managerRouter.put('/level/:levelId', deelLevelCheck);
  // 修改密码
  // commonRouter.post('/changePassword', UserController.changePassword)
};
