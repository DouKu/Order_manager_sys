'use strict';
import Goods from '../models/Goods';

const addGoods = async ctx => {
  // 验证
  ctx.verifyParams({
    name: 'string',
    price: 'number',
    picture: 'array',
    des: 'string',
    target: 'int'
  });
  // 校验用户权限
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  }
  // 添加商品逻辑
  const body = ctx.request.body;
  const a = new Goods({
    name: body.name,
    price: body.price,
    picture: body.picture,
    des: body.des,
    target: body.target
  });
  await a.save();
  ctx.body = {
    code: 200,
    msg: '创建商品成功！'
  };
};

export {
  addGoods
};
