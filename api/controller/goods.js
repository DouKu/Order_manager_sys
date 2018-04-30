'use strict';
import Goods from '../models/Goods';
import GoodsPrice from '../models/GoodsPrice';
import _ from 'lodash';
import { toObjectId } from '../service/toObjectId';

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
    des: body.des
  });
  const newPrice = new GoodsPrice({
    goods: newGoods._id,
    strategies: body.strategies
  });
  await newGoods.save();
  await newPrice.save();

  ctx.body = {
    code: 200,
    msg: '创建商品成功！'
  };
};

// web端获取商品列表
const getGoods = async ctx => {
  let res = await GoodsPrice.find().populate('goods');
  res = _.chain(res)
    .map(o => {
      return {
        name: o.goods.name,
        pictures: o.goods.pictures,
        des: o.goods.des,
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
  let res = await GoodsPrice.find().populate('goods');
  res = _.chain(res)
    .map(o => {
      return {
        id: o.goods.id,
        name: o.goods.name,
        pictures: o.goods.pictures,
        des: o.goods.des,
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
  await GoodsPrice.deleteOne({ goods: toObjectId(goodsId) });
  ctx.body = {
    code: 200,
    msg: '删除商品成功！'
  };
};

// 更新价格
const updatedPrice = async ctx => {
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  ctx.verifyParams({
    strategies: {
      type: 'array',
      itemType: 'object',
      rule: {
        agent: 'int',
        price: 'number'
      }
    }
  });
  const goodsId = ctx.params.goodsId;
  const strategies = ctx.request.body;
  await GoodsPrice.updateOne({ goods: toObjectId(goodsId) }, strategies);
  ctx.body = {
    code: 200,
    msg: '修改价格成功'
  };
};

// 更新商品信息
const updatedMess = async ctx => {
  if (!ctx.state.userMess.isManager) {
    ctx.throw(403, '权限不足');
  };
  ctx.verifyParams({
    name: { type: 'string', required: false },
    des: { type: 'string', required: false },
    pictures: {
      type: 'array',
      itemType: 'string',
      required: false
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
  updatedPrice,
  updatedMess
};
