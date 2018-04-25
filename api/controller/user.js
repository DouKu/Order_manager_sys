import User from '../models/User';
import { signToken } from '../service/base';
import Recommend from '../models/Recommend';

// 登录
const login = async ctx => {
  ctx.verifyParams({
    phoneNumber: 'string',
    password: { type: 'string', required: false },
    sms: { type: 'string', required: false },
    target: { type: 'int', required: true }
  });
  const body = ctx.request.body;
  const user = await User.findOne({ phoneNumber: body.phoneNumber });
  if (!user) {
    ctx.throw(423, '用户不存在');
  }
  if (body.password) {
    const isMatch = await user.comparePassword(ctx.request.body.password);
    if (!isMatch) {
      ctx.throw(423, '用户名或密码错误！');
    }
  } else if (body.smsCheck) {
    ctx.throw(423, '短信错误');
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
    managerId: 'string',
    recommendId: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  // 检查上级
  const manager = await User.findById(body.managerId);
  if (!manager) {
    ctx.throw(400, '上级填写错误');
  }
  // 检查推荐人
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
    idCard: body.idCard,
    managerId: body.managerId
  });
  await user.save();

  // 生成推荐人信息
  if (recommendUser) {
    const newRec = new Recommend({
      fromUserId: recommendUser.id,
      toUserId: user._id,
      fromUser: {
        nickname: recommendUser.nickname,
        realName: recommendUser.realName,
        avatar: recommendUser.avatar,
        managerId: recommendUser.managerId
      },
      toUser: {
        nickname: user.nickname,
        realName: user.realName,
        avatar: user.avatar,
        managerId: user.managerId
      }
    });
    await newRec.save();
  }

  ctx.body = {
    code: 200,
    msg: '注册成功！'
  };
};

export {
  login,
  register
};
