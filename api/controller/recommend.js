'use strict';
import Recommend from '../models/Recommend';
import _ from 'lodash';

// 我的推荐
const OwnRecommend = async ctx => {
  const nowUser = ctx.state.userMess;
  const rec = await Recommend
    .find({ fromUserId: nowUser.id })
    .sort({ createAt: -1 });

  const result = _.chain(rec)
    .map(o => {
      return {
        fromUserName: o.fromUser.realName,
        fromUserAvatar: o.fromUser.avatar,
        toUserName: o.toUser.realName,
        toUserAvatar: o.toUser.avatar,
        createAt: o.createAt
      };
    })
    .value();

  ctx.body = {
    code: 200,
    data: result
  };
};

// 某个人的推荐
const findRecommendsByUser = async ctx => {
  ctx.verifyParams({
    userId: 'string'
  }, ctx.params);
  const fromUser = ctx.params.userId;
  const rec = await Recommend
    .find({ fromUserId: fromUser })
    .sort({ createAt: -1 });

  const count = await Recommend.find({ fromUserId: fromUser }).count();

  const result = _.chain(rec)
    .map(o => {
      return {
        fromUserId: o.fromUserId,
        fromUserName: o.fromUser.realName,
        fromUserAvatar: o.fromUser.avatar,
        toUserId: o.toUserId,
        toUserName: o.toUser.realName,
        toUserAvatar: o.toUser.avatar,
        createAt: o.createAt
      };
    })
    .value();

  ctx.body = {
    code: 200,
    data: result,
    count: count
  };
};

export {
  OwnRecommend,
  findRecommendsByUser
};
