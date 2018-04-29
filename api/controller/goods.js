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

// 按等级获取商品列表
const getGoodsByTarget = async ctx => {
  const a = Object.assign({}, ctx.query);
  // 验证
  ctx.verifyParams({
    target: 'string'
  }, a);
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const target = ctx.query.target;
  const res = await Goods.find({
    target
  });
  ctx.body = {
    code: 200,
    msg: '查询商品成功！',
    data: res
  };
};

// 按商品名获取商品列表
const getGoodsByName = async ctx => {
  const a = Object.assign({}, ctx.query);
  // 验证
  ctx.verifyParams({
    name: 'string'
  }, a);
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const name = ctx.query.name;
  const res = await Goods.find({
    name
  });
  ctx.body = {
    code: 200,
    msg: '查询商品成功！',
    data: res
  };
};

// 删除所有等级的同一个商品
const deleteGoods = async ctx => {
  const a = Object.assign({}, ctx.query);
  // 验证
  ctx.verifyParams({
    name: 'string'
  }, a);
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const name = ctx.query.name;
  await Goods.deleteMany({
    name
  });
  ctx.body = {
    code: 200,
    msg: '删除商品成功！'
  };
};

// 更新所有等级的同一个商品的信息
const updatedGoodsPrice = async ctx => {
  // 验证
  ctx.verifyParams({
    id: 'string',
    price: 'number'
  });
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const id = ctx.request.body.id;
  const price = ctx.request.body.price;
  await Goods.updateOne({ _id: id }, { price });
  ctx.body = {
    code: 200,
    msg: '修改单个商品成功！'
  };
};

const updatedGoodsInfo = async ctx => {
  // 验证
  ctx.verifyParams({
    name: 'string',
    info: {
      type: 'object',
      require: true,
      rule: {
        name: {
          type: 'string',
          required: false
        },
        pictures: {
          type: 'array',
          required: false,
          itemType: 'string'
        },
        des: {
          type: 'string',
          required: false
        }
      }
    }
  });
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const name = ctx.request.body.name;
  const info = ctx.request.body.info;
  // 保证info里没用price。
  if (info.price) {
    ctx.throw(403, '参数错误');
  }
  await Goods.updateMany({ name }, info);
  ctx.body = {
    code: 200,
    msg: '修改单个商品成功！'
  };
};

export {
  addGoods,
  getGoodsByTarget,
  getGoodsByName,
  deleteGoods,
  updatedGoodsPrice,
  updatedGoodsInfo
};
