'use strict';
import Message from '../models/Message';
import UserMessage from '../models/UserMessage';
import _ from 'lodash';
import { toObjectId } from '../service/toObjectId';

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
    data
  };
};

const getAllMess = async ctx => {
  const data = await Message.find({ userId: ctx.state.userMess.id })
    .populate('fromUser', 'realName')
    .sort({ createAt: -1 });

  ctx.body = {
    code: 200,
    data
  };
};

const readMess = async ctx => {
  const messId = ctx.params.messId;
  const data = await UserMessage.findOneAndUpdate(
    { userId: ctx.state.userMess.id },
    { $pull: { messages: toObjectId(messId) } },
    { new: true }
  );
  ctx.body = {
    code: 200,
    data
  };
};

export {
  getUnReadMess,
  getAllMess,
  readMess
};
