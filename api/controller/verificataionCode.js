'use strict';
import VCode from '../models/VerificationCode';
import moment from 'moment';
import { sendCode } from '../service/verificationCode';

const applyCode = async ctx => {
  const phone = ctx.query.phone;
  if (phone === null) {
    ctx.throw(400, '参数错误');
  }
  // 查看15分钟内电话验证码是否存在没有用的
  const expiredTime = moment().subtract(15, 'minutes').format();
  let code = await VCode.findOne({
    phone: phone,
    use: false
  })
    .where('createAt').gte(expiredTime).lte(Date.now());

  // 存在没有过期的验证码
  if (code) {
    await sendCode([phone], code.code);
  } else {
    // 需要重新生成验证码
    const random = Math.floor(Math.random() * 1000000);
    code = new VCode({
      phone: phone,
      code: random
    });
    await code.save();
    await sendCode([phone], random);
  }
  ctx.body = {
    code: 200,
    msg: '验证码发送成功!'
  };
};

const verifyCode = async ctx => {
  ctx.verifyParams({
    phone: 'string',
    code: 'string'
  });
  const body = ctx.request.body;
  const result = await VCode.updateOne({
    phone: body.phone,
    code: body.code
  }, { use: true });
  if (result.nModified >= 1) {
    ctx.body = {
      code: 200,
      msg: '验证成功!'
    };
  } else {
    ctx.body = {
      code: 400,
      msg: '验证码不正确!'
    };
  }
};

export {
  applyCode,
  verifyCode
};
