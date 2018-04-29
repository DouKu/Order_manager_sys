'use strict';
import moment from 'moment';
import _ from 'lodash';
import Order from '../models/Order';
import { toObjectId } from '../service/toObjectId';

// 查看我的下单(需要时间范围,分页)
const checkMyOrder = async ctx => {
  ctx.verifyParams({
    beginDate: { type: 'datetime', required: false },
    endDate: { type: 'datetime', required: false },
    state: { type: 'int', required: false }
  });
  const body = ctx.request.body;
  // 时间范围默认为一个月
  body.endDate = body.endDate || Date.now();
  body.beginDate = body.beginDate || moment(body.endDate).subtract(1, 'months').format();
  const conditions = _.omit(body, ['beginDate', 'endDate']);
  conditions.fromUser = toObjectId(ctx.state.userMess.id);
  const result = await Order
    .find(conditions)
    .where('createAt').gte(body.beginDate).lte(body.endDate)
    .populate('toUser', 'realName avatar level')
    .sort({ createAt: -1 });

  ctx.body = {
    code: 200,
    data: result
  };
};

// 查看我的订单(需要时间范围,分页)
const checkMyBill = async ctx => {
  ctx.verifyParams({
    beginDate: { type: 'datetime', required: false },
    endDate: { type: 'datetime', required: false },
    state: { type: 'int', required: false }
  });
  const body = ctx.request.body;
  // 时间范围默认为一个月
  body.endDate = body.endDate || Date.now();
  body.beginDate = body.beginDate || moment().subtract(1, 'months').format();
  const conditions = _.omit(body, ['beginDate', 'endDate']);
  conditions.toUser = toObjectId(ctx.state.userMess.id);
  const result = await Order
    .find(conditions)
    .where('createAt').gte(body.beginDate).lte(body.endDate)
    .populate('fromUser', 'realName avatar level')
    .sort({ createAt: -1 });

  ctx.body = {
    code: 200,
    data: result
  };
};

// 向上级下单
const addOrder = async ctx => {
  ctx.verifyParams({
    goods: {
      type: 'array',
      itemType: 'object',
      required: false,
      rule: {
        name: 'string',
        price: 'number',
        picture: 'string',
        num: 'int'
      }
    },
    address: 'string',
    receivePeople: 'string',
    postalCode: 'string',
    receivePhone: 'string'
  });
  const body = ctx.request.body;
  let sumPrice = 0;
  for (let good of body.goods) {
    sumPrice += good.price * good.num;
  }
  // 保留2位小数
  sumPrice.toFixed(2);
  const newOrder = new Order({
    fromUser: ctx.state.userMess.id,
    toUser: ctx.state.userMess.managerId,
    goods: body.goods,
    sumPrice: sumPrice,
    state: 1,
    address: body.address,
    receivePeople: body.receivePeople,
    postalCode: body.postalCode,
    receivePhone: body.receivePhone
  });
  await newOrder.save();
  ctx.body = {
    code: 200,
    msg: '下单成功！'
  };
};

// 修改订单状态
const markOrder = async ctx => {
  ctx.verifyParams({
    state: [1, 2, 3, 4, 5, 6, 7, 8],
    trackingNumber: { type: 'string', required: false }
  });
  const body = ctx.request.body;
  if (body.state === 4 && !_.has(body, 'trackingNumber')) {
    ctx.throw(400, '需要填写快递单号才能标记发货噢！');
  }
  const orderId = ctx.params.orderId;
  const orderMessage = await Order.findOneAndUpdate(
    { _id: orderId },
    body,
    { new: true }
  );
  ctx.body = {
    code: 200,
    data: orderMessage
  };
};

export {
  checkMyOrder,
  checkMyBill,
  addOrder,
  markOrder
};
