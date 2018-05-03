'use strict';
import Configs from '../models/Configs';

// 获取公共配置
const showConfigs = async ctx => {
  const data = await Configs.findOne();
  ctx.body = {
    code: 200,
    data
  };
};

// 修改公共配置
const changeConifgs = async ctx => {
  ctx.verifyParams({
    expiredMonths: { type: 'int', required: false }
  });
  const body = ctx.request.body;
  const data = await Configs.findOneAndUpdate({}, body, { new: true });
  ctx.body = {
    code: 200,
    msg: '配置修改成功!',
    data
  };
};

export {
  showConfigs,
  changeConifgs
};
