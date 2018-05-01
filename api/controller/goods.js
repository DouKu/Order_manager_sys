'use strict';
import Goods from '../models/Goods';
import _ from 'lodash';

const addGoods = async ctx => {
  // 校验用户权限
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  }
  // 验证
  ctx.verifyParams({
    name: 'string',
    pictures: 'array',
    des: 'string',
    strategies: {
      type: 'array',
      itemType: 'object',
      rule: {
        agent: 'int',
        price: 'number'
      }
    }
  });
  // 添加商品逻辑
  const body = ctx.request.body;
  const checkGoods = await Goods.findOne({ name: body.name });
  if (checkGoods) {
    ctx.throw(400, '商品已经存在了，请添加其他商品');
  }
  const newGoods = new Goods({
    name: body.name,
    pictures: body.pictures,
    des: body.des,
    strategies: body.strategies
  });

  await newGoods.save();

  ctx.body = {
    code: 200,
    msg: '创建商品成功！'
  };
};

// web端获取商品列表
const getGoods = async ctx => {
  let res = await Goods.find();
  res = _.chain(res)
    .map(o => {
      return {
        name: o.name,
        pictures: o.pictures,
        des: o.des,
        price: _.filter(o.strategies, { agent: ctx.state.userMess.level })[0].price
      };
    })
    .value();
  ctx.body = {
    code: 200,
    msg: '查询商品成功！',
    data: res
  };
};

// 后台管理获取商品列表
const getAllGoods = async ctx => {
  let res = await Goods.find();
  res = _.chain(res)
    .map(o => {
      return {
        id: o.id,
        name: o.name,
        pictures: o.pictures,
        des: o.des,
        strategies: o.strategies
      };
    })
    .value();
  ctx.body = {
    code: 200,
    data: res
  };
};

// 删除商品
const deleteGoods = async ctx => {
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  const goodsId = ctx.params.goodsId;
  await Goods.deleteOne({ _id: goodsId });
  ctx.body = {
    code: 200,
    msg: '删除商品成功！'
  };
};

// 更新商品信息
const updatedMess = async ctx => {
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  ctx.verifyParams({
    name: 'string',
    des: 'string',
    pictures: {
      type: 'array',
      itemType: 'string'
    },
    strategies: {
      type: 'array',
      itemType: 'object',
      rule: {
        agent: 'int',
        price: 'number'
      }
    }
  });
  const body = ctx.request.body;
  const checkGoods = await Goods.findOne({ name: body.name });
  if (checkGoods) {
    ctx.throw(400, `"${body.name}"已拥有，请修改为其他名字`);
  }
  const goodsId = ctx.params.goodsId;
  body.updateAt = Date.now();
  await Goods.findByIdAndUpdate(goodsId, body);
  ctx.body = {
    code: 200,
    msg: '修改商品信息成功！'
  };
};

export {
  addGoods,
  getGoods,
  getAllGoods,
  deleteGoods,
  updatedMess
};
