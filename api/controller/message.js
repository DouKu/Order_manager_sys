'use strict';
import Message from '../models/Message';
import UserMessage from '../models/UserMessage';
import _ from 'lodash';
import { toObjectId } from '../service/toObjectId';
import { addMessage } from '../service/message';

// 获取未读通知
const getUnReadMess = async ctx => {
  const unReadMess = await UserMessage
    .findOne({ userId: ctx.state.userMess.id })
    .populate({
      path: 'messages',
      populate: { path: 'fromUser', select: 'realName' }
    });
  let data = _.chain(unReadMess.messages)
    .map(o => {
      return {
        id: o.id,
        type: o.type,
        fromUser: o.fromUser.realName,
        title: o.title,
        message: o.message,
        createAt: o.createAt
      };
    })
    .value();
  data = _.orderBy(data, ['createAt'], ['desc']);

  ctx.body = {
    code: 200,
    data,
    count: data.length
  };
};

// 获取用户有关的通知
const getAllMess = async ctx => {
  ctx.verifyParams({
    page: { type: 'int', min: 1 },
    limit: 'int'
  });
  const page = ctx.request.body.page;
  const limit = ctx.request.body.limit;
  let data = await Message.find(
    { $or: [{ toUser: ctx.state.userMess.id }, { type: 3 }] }
  )
    .populate('fromUser', 'realName')
    .sort({ createAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  data = _.chain(data)
    .map(o => {
      return {
        createAt: o.createAt,
        type: o.type,
        fromUser: o.fromUser.realName,
        title: o.id,
        message: o.message,
        id: o.id
      };
    })
    .value();

  ctx.body = {
    code: 200,
    data
  };
};

// 读通知
const readMess = async ctx => {
  const messId = ctx.params.messId;
  await UserMessage.findOneAndUpdate(
    { userId: ctx.state.userMess.id },
    { $pull: { messages: toObjectId(messId) } },
    { new: true }
  );
  ctx.body = {
    code: 200,
    msg: '标记成功！'
  };
};

// 通知详情
const messDetail = async ctx => {
  const messId = ctx.params.messId;
  let data = await Message.findById(messId).populate('fromUser', 'realName');
  data = data.toObject();
  data.fromUser = data.fromUser.realName;
  ctx.body = {
    code: 200,
    data
  };
};

// 标记全部已读
const readAll = async ctx => {
  await UserMessage.findOneAndUpdate(
    { userId: ctx.state.userMess.id },
    { messages: [] }
  );
  ctx.body = {
    code: 200,
    msg: '全部消息标为已读！'
  };
};

// 发布公告
const announcement = async ctx => {
  ctx.verifyParams({
    title: 'string',
    message: 'string'
  });
  const body = ctx.request.body;
  const data = {
    type: 3,
    fromUser: ctx.state.userMess.id,
    title: body.title,
    message: body.message
  };
  await addMessage(data);
  ctx.body = {
    code: 200,
    msg: '公告发布成功！'
  };
};

export {
  getUnReadMess,
  getAllMess,
  readMess,
  messDetail,
  readAll,
  announcement
};
