'use strict';
import User from '../models/User';
import Recommend from '../models/Recommend';
import Agent from '../models/Agent';
import UserMessage from '../models/UserMessage';
import Config from '../models/Configs';
import LevelUp from '../models/Levelup';
import { signToken } from '../service/base';
import _ from 'lodash';
import moment from 'moment';
import { toObjectId } from '../service/toObjectId';
import { addMessage } from '../service/message';

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
    ctx.throw(400, '您的以被封号请联系管理员');
  } else if (user.expiredAt < Date.now()) {
    ctx.throw(400, '您的账号已过期请联系管理员');
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
  // 检查用户
  const userCheck = await User.findOne({ $or:
    [
      { phoneNumber: body.phoneNumber },
      { idCard: body.idCard }
    ]
  });
  if (userCheck) {
    if (userCheck.phoneNumber === body.phoneNumber) {
      ctx.throw(400, '该电话号码已被注册');
    } else if (userCheck.idCard === body.idCard) {
      ctx.throw(400, '该身份证已被注册，请更换或者联系管理员解决');
    }
  }
  let recommendUser = null;
  if (body.recommendId) {
    recommendUser = await User.findById(body.recommendId);
    if (!recommendUser) {
      ctx.throw(400, '推荐人信息错误');
    }
  }

  // 获取过期时间配置
  const sysConfig = await Config.findOne({});

  // 生成用户信息
  const user = new User({
    phoneNumber: body.phoneNumber,
    password: body.password,
    realName: body.realName,
    idCard: body.idCard,
    expiredAt: moment().add(sysConfig.expiredMonths, 'months').format()
  });
  await user.save();

  // 生成用户消息表
  const userMessage = new UserMessage({
    userId: user._id,
    messages: []
  });

  await userMessage.save();

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
  const mess = await UserMessage.findOne({ userId: ctx.state.userMess.id });
  const nowUser = ctx.state.userMess;
  const result = _.omit(
    nowUser,
    ['password', 'managerId', 'appSecret', 'isManager', 'isLock', 'isActive']
  );
  const userAgent = _.filter(agents, ['level', result.level])[0];
  result.agent = userAgent.des;
  result.messageUnRead = mess.messages.length;
  if (manager) {
    result.manager = manager.realName;
  }
  ctx.body = {
    code: 200,
    data: result
  };
};

// 根据id获取下属详细信息
const getBubordinate = async ctx => {
  const userId = ctx.params.userId;
  let data = await User.find({ managerId: toObjectId(userId) });
  data = _.chain(data)
    .map(o => {
      _.omit(o,
        ['password', 'managerId', 'appSecret', 'isManager', 'isLock', 'isActive']
      );
    })
    .value();
  ctx.body = {
    code: 200,
    data
  };
};

// 等级提升申请
const levelUp = async ctx => {
  ctx.verifyParams({
    level: 'int'
  });
  const level = ctx.request.body.level;
  // 找出是否存在待处理的升级请求
  const upCheck = await LevelUp.findOne({
    applyUser: ctx.state.userMess.id,
    deel: 1
  });
  if (upCheck) {
    ctx.throw(400, '您有待处理的等级申请不能申请多次!');
  }
  if (level >= ctx.state.userMess.level) {
    ctx.throw(400, '申请等级低于您当前等级');
  }

  const newUp = new LevelUp({
    applyUser: ctx.state.userMess.id,
    toUser: ctx.state.userMess.managerId,
    applyLevel: level,
    deel: 1
  });
  const agents = await Agent.find();
  const userAgent = _.filter(agents, ['level', level])[0];
  const mess = {
    type: 2,
    fromUser: ctx.state.userMess.id,
    toUser: ctx.state.userMess.managerId,
    title: '升级申请',
    message: `用户：${ctx.state.userMess.realName}申请升级为：${userAgent.des}`
  };
  await addMessage(mess);
  await newUp.save();
  ctx.body = {
    code: 200,
    msg: '等级申请成功'
  };
};

// 查看本人代理记录
const checkLevel = async ctx => {
  const data = await LevelUp.find({ applyUser: ctx.state.userMess.id });
  ctx.body = {
    code: 200,
    data
  };
};

// 查看下级代理记录
const checkSubLevel = async ctx => {
  const data = await LevelUp.find({ toUser: ctx.state.userMess.id });
  ctx.body = {
    code: 200,
    data
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
  let data = await User.find(conditions)
    .populate('managerId', 'realName')
    .where('createAt').gte(beginDate).lte(endDate)
    .sort(sort)
    .skip(skip)
    .limit(body.limit);

  data = _.chain(data)
    .map(o => {
      let manager = null;
      o.managerId ? manager = o.managerId.realName : manager = null;
      return {
        phoneNumber: o.phoneNumber,
        nickname: o.nickname,
        realName: o.realName,
        idCard: o.idCard,
        level: o.level,
        avatar: o.avatar,
        manager,
        isManager: o.isManager,
        isLock: o.isLock,
        isActive: o.isActive,
        createAt: o.createAt,
        expiredAt: o.expiredAt
      };
    })
    .value();
  const count = await User.count(conditions);

  ctx.body = {
    code: 200,
    data,
    count
  };
};

// 创建用户
const newUser = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    password: 'string',
    nickname: { type: 'string', required: false },
    realName: 'string',
    idCard: { type: 'string', min: 18, max: 18 },
    level: 'int',
    avatar: { type: 'string', required: false },
    sign: { type: 'string', required: false },
    managerId: { type: 'string', required: false },
    isManager: 'boolean'
  });
  const body = ctx.request.body;
  body.expiredAt = body.expiredAt || moment('2222-02-22');
  const userCheck = await User.findOne({ $or:
    [
      { phoneNumber: body.phoneNumber },
      { idCard: body.idCard }
    ]
  });
  if (userCheck) {
    if (userCheck.phoneNumber === body.phoneNumber) {
      ctx.throw(400, '该电话已被注册，请更换');
    } else if (userCheck.idCard === body.idCard) {
      ctx.throw(400, '该身份证已被注册，请更换');
    }
  }
  if (body.managerId) {
    const manager = await User.findById(body.managerId);
    if (manager.level >= body.level) {
      ctx.throw(400, '您填的上级的代理等级比生成的账号低(相等)，请调整相关账号信息');
    }
  }
  const user = new User(body);
  await user.save();
  ctx.body = {
    code: 200,
    msg: '成功生成一个新用户！'
  };
};

// 代理升级请求列表
const listLevel = async ctx => {
  ctx.verifyParams({
    page: 'int',
    limit: 'int',
    conditions: {
      type: 'object',
      rule: {
        beginDate: { type: 'datetime', required: false },
        endDate: { type: 'datetime', required: false },
        deel: { type: 'int', required: false },
        applyUser: { type: 'string', required: false }
      }
    },
    sort: {
      type: 'object',
      rule: {
        createAt: { type: 'enum', values: [-1, 1], required: false }
      }
    }
  });
  const body = ctx.request.body;
  const endDate = body.conditions.endDate || Date.now();
  const beginDate = body.conditions.beginDate || moment('1971-01-01').format();
  const skip = (body.page - 1) * body.limit;
  const conditions = _.omit(body.conditions, ['beginDate', 'endDate']);
  if (conditions.applyUser) {
    conditions.applyUser = toObjectId(conditions.applyUser);
  }
  const sort = Object.assign({
    deel: 1,
    applyLevel: 1,
    createAt: -1,
    updateAt: -1
  }, body.sort);

  let data = await LevelUp.find(conditions)
    .where('createAt').gte(beginDate).lte(endDate)
    .populate('applyUser', 'realName level')
    .sort(sort)
    .skip(skip)
    .limit(body.limit);

  const count = await LevelUp.count(conditions);

  data = _.chain(data)
    .map(o => {
      return {
        id: o.id,
        createAt: o.createAt,
        updateAt: o.updateAt,
        applyUserName: o.applyUser.realName,
        applyUserLevel: o.applyUser.level,
        applyUserId: o.applyUser.id,
        deel: o.deel,
        applyLevel: o.applyLevel
      };
    })
    .value();
  ctx.body = {
    code: 200,
    data,
    count
  };
};

// 代理审核
const deelLevelCheck = async ctx => {
  ctx.verifyParams({
    deel: [2, 3]
  });
  const levelId = ctx.params.levelId;
  const deel = ctx.request.body.deel;
  const agents = await Agent.find();
  if (deel === 2) {
    // 同意升级，修改申请信息
    const levelMess = await LevelUp.findByIdAndUpdate(levelId,
      { deel: 2, updateAt: Date.now() }
    );
    const userAgent = _.filter(agents, ['level', levelMess.applyLevel])[0];
    // 升级用户
    await User.findByIdAndUpdate(levelMess.applyUser, { level: levelMess.applyLevel });
    // 发送通知
    const mess = {
      type: 2,
      fromUser: ctx.state.userMess.id,
      toUser: levelMess.applyUser,
      title: '升级申请审核',
      message: `您的${userAgent.des}升级申请以被同意，恭喜您经成为${userAgent.des}！`
    };
    await addMessage(mess);
  } else if (deel === 3) {
    // 拒绝升级，修改申请
    const levelMess = await LevelUp.findByIdAndUpdate(levelId,
      { deel: 3, updateAt: Date.now() }
    );
    const userAgent = _.filter(agents, ['level', levelMess.applyLevel])[0];
    // 发送消息
    const mess = {
      type: 2,
      fromUser: ctx.state.userMess.id,
      toUser: levelMess.applyUser,
      title: '升级申请审核',
      message: `您的${userAgent.des}升级申请被管理员拒绝，请继续努力！`
    };
    await addMessage(mess);
  }
  ctx.body = {
    code: 200,
    msg: '审核成功!'
  };
};

export {
  login,
  register,
  getUserInfo,
  getBubordinate,
  lockUser,
  listUser,
  newUser,
  levelUp,
  checkLevel,
  checkSubLevel,
  listLevel,
  deelLevelCheck
};
