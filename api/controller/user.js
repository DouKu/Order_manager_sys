'use strict';
import User from '../models/User';
import Recommend from '../models/Recommend';
import Agent from '../models/Agent';
import { signToken } from '../service/base';
import _ from 'lodash';
import moment from 'moment';

// 登录
const login = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    password: { type: 'string', required: false },
    target: { type: 'int', required: true }
  });
  const body = ctx.request.body;
  const user = await User.findOne({ phoneNumber: body.phoneNumber });
  if (!user) {
    ctx.throw(423, '用户不存在');
  } else if (user.isLock) {
    ctx.throw(400, '您的账号已过期/以被封号请联系管理员');
  }
  if (body.password) {
    const isMatch = await user.comparePassword(ctx.request.body.password);
    if (!isMatch) {
      ctx.throw(423, '用户名或密码错误！');
    }
  } else {
    ctx.throw(400, '登录表单错误');
  }
  // 检查登录的系统
  if (body.target === 2) {
    if (!user.isManager) {
      ctx.throw(403, '您无权限登录该系统');
    }
  }
  const token = signToken(user);
  ctx.body = {
    code: 200,
    msg: '登录成功!',
    token: token
  };
};

// 注册
const register = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    password: 'string',
    realName: 'string',
    idCard: 'string',
    recommendId: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  let recommendUser = null;
  if (body.recommendId) {
    recommendUser = await User.findById(body.recommendId);
    if (!recommendUser) {
      ctx.throw(400, '推荐人信息错误');
    }
  }

  // 生成用户信息
  const user = new User({
    phoneNumber: body.phoneNumber,
    password: body.password,
    realName: body.realName,
    idCard: body.idCard
  });
  await user.save();

  // 生成推荐人信息
  if (recommendUser) {
    const newRec = new Recommend({
      fromUser: recommendUser.id,
      toUser: user._id
    });
    await newRec.save();
  }

  ctx.body = {
    code: 200,
    msg: '注册成功！'
  };
};

// 个人详细信息
const getUserInfo = async ctx => {
  const agents = await Agent.find();
  const manager = await User.findById(ctx.state.userMess.managerId);
  const nowUser = ctx.state.userMess;
  const result = _.omit(
    nowUser,
    ['password', 'managerId', 'appSecret', 'isManager', 'isLock']
  );
  const userAgent = _.filter(agents, ['level', result.level])[0];
  result.agent = userAgent.des;
  if (manager) {
    result.manager = manager.realName;
  }
  ctx.body = {
    code: 200,
    data: result
  };
};

// 封号/(解封)
const lockUser = async ctx => {
  const userId = ctx.params.userId;
  ctx.verifyParams({
    isLock: 'boolean'
  });
  const body = ctx.request.body;
  await User.findByIdAndUpdate(userId, body);
  ctx.body = {
    code: 200,
    msg: body.isLock ? '封号成功' : '解封成功'
  };
};

// 用户列表(分页)
const listUser = async ctx => {
  ctx.verifyParams({
    page: { type: 'int', min: 1 },
    limit: 'int',
    conditions: {
      type: 'object',
      rule: {
        beginDate: { type: 'datetime', required: false },
        endDate: { type: 'datetime', required: false },
        level: { type: 'int', required: false },
        _id: { type: 'string', required: false },
        realName: { type: 'string', required: false }
      }
    },
    sort: {
      type: 'object',
      rule: {
        createAt: { type: 'enum', values: [-1, 1], required: false },
        level: { type: 'enum', values: [-1, 1], required: false }
      }
    }
  });
  const body = ctx.request.body;
  const endDate = body.conditions.endDate || Date.now();
  const beginDate = body.conditions.beginDate || moment('1971-01-01').format();
  const skip = (body.page - 1) * body.limit;
  const conditions = _.omit(body.conditions, ['beginDate', 'endDate']); ;
  const sort = Object.assign({
    createAt: -1,
    level: 1
  }, body.sort);
  const data = await User.find(conditions)
    .where('createAt').gte(beginDate).lte(endDate)
    .sort(sort)
    .skip(skip)
    .limit(body.limit);
  ctx.body = {
    code: 200,
    data
  };
};

export {
  login,
  register,
  getUserInfo,
  lockUser,
  listUser
};
