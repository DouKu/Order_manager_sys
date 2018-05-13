'use strict';
import _ from 'lodash';
import moment from 'moment';
import User from '../models/User';
import Recommend from '../models/Recommend';
import Agent from '../models/Agent';
import UserMessage from '../models/UserMessage';
import Config from '../models/Configs';
import LevelUp from '../models/Levelup';
import Summary from '../models/Summary';
import MSummary from '../models/Msummary';
import YSummary from '../models/Ysummary';
import VCode from '../models/VerificationCode';
import { signToken } from '../service/base';
import { toObjectId } from '../service/toObjectId';
import { addMessage } from '../service/message';
import { sendLevelUpMess } from '../service/levelUp';

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
    token: token,
    isActive: user.isActive
  };
};

// 电话登录
const phoneLogin = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    code: 'string',
    target: 'int'
  });
  const body = ctx.request.body;
  const user = await User.findOne({ phoneNumber: body.phoneNumber });
  // 查看用户状态
  if (!user) {
    ctx.throw(423, '用户不存在');
  } else if (user.isLock) {
    ctx.throw(400, '您的以被封号请联系管理员');
  } else if (user.expiredAt < Date.now()) {
    ctx.throw(400, '您的账号已过期请联系管理员');
  }
  // 验证短信
  const result = await VCode.updateOne({
    phone: body.phoneNumber,
    code: body.code
  }, { use: true });
  if (result.nModified >= 1) {
    const token = signToken(user);
    ctx.body = {
      code: 200,
      msg: '登录成功!',
      token: token,
      isActive: user.isActive
    };
  } else {
    ctx.body = {
      code: 400,
      msg: '验证码不正确!'
    };
  }
};

// 注册
const register = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    password: 'string',
    realName: 'string',
    idCard: 'string',
    recommendId: 'string'
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

  // 生成三个统计表
  const summary = new Summary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await summary.save();

  const msummary = new MSummary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await msummary.save();

  const ysummary = new YSummary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await ysummary.save();

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

const changePersionMess = async ctx => {
  ctx.verifyParams({
    nickname: { type: 'string', required: false },
    avatar: { type: 'string', required: false },
    sign: { type: 'string', required: false }
  });
  const userId = ctx.params.userId;
  const body = ctx.request.body;
  await User.findByIdAndUpdate(userId, body);
  ctx.body = {
    code: 200,
    msg: '个人信息修改成功!'
  };
};

// 激活账号
const activeAccount = async ctx => {
  if (ctx.state.userMess.isActive) {
    ctx.throw(400, '您的账号已经激活了');
  }
  ctx.verifyParams({
    level: 'int',
    screenshots: 'string'
  });
  const level = ctx.request.body.level;
  const screenshots = ctx.request.body.screenshots;
  // 找出是否存在待处理的升级请求
  const upCheck = await LevelUp.findOne({
    applyUser: ctx.state.userMess.id,
    deel: 1
  });
  if (upCheck) {
    ctx.throw(400, '您有待处理的等级申请不能申请多次!');
  }

  const newUp = new LevelUp({
    applyUser: ctx.state.userMess.id,
    type: 2,
    applyLevel: level,
    screenshots,
    deel: 1
  });
  await newUp.save();
  ctx.body = {
    code: 200,
    msg: '激活申请以提交，请等待管理员处理结果。'
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
    ['password', 'managerId', 'appSecret', 'isManager', 'isLock']
  );
  // 等级划分
  if (result.level > 20) {
    result.agent = '代理未激活';
  } else {
    const userAgent = _.filter(agents, ['level', result.level])[0];
    result.agent = userAgent.des;
  }
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
  let data = await User.find({ managerId: toObjectId(userId) })
    .populate('managerId', 'realName');
  data = _.chain(data)
    .map(o => {
      let manager = o.managerId.realName ? o.managerId.realName : '无';
      let managerId = o.managerId.id ? o.managerId.id : null;
      return {
        level: o.level,
        createAt: o.createAt,
        expiredAt: o.expiredAt,
        phoneNumber: o.phoneNumber,
        realName: o.realName,
        nickname: o.nickname,
        idCard: o.idCard,
        manager,
        managerId,
        id: o.id
      };
    })
    .value();
  ctx.body = {
    code: 200,
    data
  };
};

// 等级提升申请
const levelUp = async ctx => {
  if (!ctx.state.userMess.isActive) {
    ctx.throw(400, '请您先激活账号!');
  }
  ctx.verifyParams({
    level: 'int',
    screenshots: 'string'
  });
  const level = ctx.request.body.level;
  const screenshots = ctx.request.body.screenshots;
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
    type: 1,
    applyLevel: level,
    screenshots,
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
  let data = await LevelUp.find({ applyUser: ctx.state.userMess.id });
  ctx.body = {
    code: 200,
    data
  };
};

// 查看下级代理记录
const checkSubLevel = async ctx => {
  let data = await LevelUp.find({ toUser: ctx.state.userMess.id })
    .populate('applyUser', 'realName');

  data = _.chain(data)
    .map(o => {
      return {
        applyUser: o.applyUser.realName,
        applyUserId: o.applyUser.id,
        applyLevel: o.applyLevel,
        deel: o.deel,
        id: o.id,
        createAt: o.createAt,
        updateAt: o.updateAt
      };
    });
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
    .where('createAt').gte(beginDate).lte(endDate)
    .populate('managerId', 'realName')
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
  const count = await User.count(conditions)
    .where('createAt').gte(beginDate).lte(endDate);

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
  // 生成用户消息表
  const userMessage = new UserMessage({
    userId: user._id,
    messages: []
  });
  await userMessage.save();

  // 生成三个统计表
  const summary = new Summary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await summary.save();

  const msummary = new MSummary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await msummary.save();

  const ysummary = new YSummary({
    user: user._id,
    goods: [],
    createAt: Date.now()
  });
  await ysummary.save();

  ctx.body = {
    code: 200,
    msg: '成功生成一个新用户！'
  };
};

// 修改用户上级
const changeManager = async ctx => {
  ctx.verifyParams({
    userId: 'string',
    managerId: 'string'
  });
  const userId = ctx.request.body.userId;
  const managerId = ctx.request.body.managerId;
  const manager = await User.findById(managerId);
  const user = await User.findById(userId);
  if (user === null || manager === null) {
    ctx.throw(400, '用户/上级id错误');
  }
  if (manager.level >= user.level) {
    ctx.throw(400, '所选上级等级不比需要修改上级的用户高，上级修改失败');
  }
  await User.findByIdAndUpdate(userId, { managerId: manager.id });
  ctx.body = {
    code: 200,
    msg: '上级修改成功'
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
        applyUser: { type: 'string', required: false },
        type: { type: 'int', required: false }
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
    type: -1,
    deel: 1,
    createAt: -1
  }, body.sort);

  let data = await LevelUp.find(conditions)
    .where('createAt').gte(beginDate).lte(endDate)
    .populate('applyUser', 'realName level')
    .sort(sort)
    .skip(skip)
    .limit(body.limit);

  const count = await LevelUp.count(conditions)
    .where('createAt').gte(beginDate).lte(endDate);

  data = _.chain(data)
    .map(o => {
      return {
        id: o.id,
        createAt: o.createAt,
        updateAt: o.updateAt,
        applyUserName: o.applyUser.realName,
        applyUserLevel: o.applyUser.level,
        screenshots: o.screenshots,
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
  let levelMess = null;
  let userAgent = null;
  if (deel === 2) {
    // 同意升级，修改申请信息
    levelMess = await LevelUp.findByIdAndUpdate(levelId,
      { deel: 2, updateAt: Date.now() }
    );
    userAgent = _.filter(agents, ['level', levelMess.applyLevel])[0];
    // 升级用户
    await User.findByIdAndUpdate(levelMess.applyUser, {
      level: levelMess.applyLevel,
      isActive: true
    });
    // 如果是激活请求，需要给用户加上上级
    if (levelMess.type === 2) {
      const user = await User.findById(levelMess.applyUser);
      let manager = await User.findById(user.recommendId);
      while (manager.level >= user.level) {
        manager = await User.findById(manager.managerId);
      }
      await User.findByIdAndUpdate(user.id, { managerId: manager.id });
    }
  } else if (deel === 3) {
    // 拒绝升级，修改申请
    levelMess = await LevelUp.findByIdAndUpdate(levelId,
      { deel: 3, updateAt: Date.now() }
    );
    userAgent = _.filter(agents, ['level', levelMess.applyLevel])[0];
  }
  // 按照申请类别发送通知
  await sendLevelUpMess(
    deel,
    levelMess.type,
    ctx.state.userMess.id,
    levelMess.applyUser,
    userAgent
  );
  ctx.body = {
    code: 200,
    msg: '审核成功!'
  };
};

export {
  login,
  phoneLogin,
  register,
  changePersionMess,
  changeManager,
  activeAccount,
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
