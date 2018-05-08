'use strict';
import moment from 'moment';
import _ from 'lodash';
import Order from '../models/Order';
import { toObjectId } from '../service/toObjectId';
import { addMessage } from '../service/message';
import { orderIm } from '../service/order';

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
        picture: { type: 'string', required: false },
        num: 'int'
      }
    },
    screenshots: 'string',
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
    screenshots: body.screenshots,
    address: body.address,
    receivePeople: body.receivePeople,
    postalCode: body.postalCode,
    receivePhone: body.receivePhone
  });
  await newOrder.save();
  // 添加消息
  const message = {
    type: 1,
    fromUser: ctx.state.userMess.id,
    toUser: ctx.state.userMess.managerId,
    title: '新订单！',
    message: `用户“${ctx.state.userMess.realName}”向您提交了一个新订单。`
  };
  await addMessage(message);
  ctx.body = {
    code: 200,
    msg: '下单成功！'
  };
};

// 修改订单状态
const markOrder = async ctx => {
  ctx.verifyParams({
    state: [2, 3, 4, 5, 6, 7, 8],
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
  const Im = orderIm(ctx.state.userMess, body.state, orderMessage);
  await addMessage(Im);
  ctx.body = {
    code: 200,
    data: orderMessage
  };
};

// 订单查询(分页)
const listOrder = async ctx => {
  ctx.verifyParams({
    page: { type: 'int', min: 1 },
    limit: 'int',
    conditions: {
      type: 'object',
      rule: {
        beginDate: { type: 'datetime', required: false },
        endDate: { type: 'datetime', required: false },
        state: { type: 'int', required: false }
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
  const conditions = _.omit(body.conditions, ['beginDate', 'endDate']); ;
  const sort = Object.assign({
    createAt: -1
  }, body.sort);
  let data = await Order.find(conditions)
    .where('createAt').gte(beginDate).lte(endDate)
    .populate('fromUser', 'realName level')
    .populate('toUser', 'realName level')
    .sort(sort)
    .skip(skip)
    .limit(body.limit);

  const count = await Order.count(conditions);

  data = _.chain(data)
    .map(o => {
      return {
        id: o.id,
        createAt: o.createAt,
        fromUserName: o.fromUser.realName,
        fromUserLevel: o.fromUser.level,
        fromUserId: o.fromUser.id,
        toUserName: o.toUser.realName,
        toUserLevel: o.toUser.level,
        toUserId: o.toUser.id,
        goods: o.goods,
        state: o.state,
        sumPrice: o.sumPrice,
        screenshots: o.screenshots
      };
    })
    .value();
  ctx.body = {
    code: 200,
    data,
    count
  };
};

// 订单详情
const orderDetail = async ctx => {
  const orderId = ctx.params.orderId;
  const data = await Order.findById(orderId)
    .populate('fromUser', 'phoneNumber realName level')
    .populate('toUser', 'phoneNumber realName level');
  ctx.body = {
    code: 200,
    data
  };
};

export {
  checkMyOrder,
  checkMyBill,
  addOrder,
  markOrder,
  listOrder,
  orderDetail
};
