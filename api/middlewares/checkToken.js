'use strict';

import User from '../models/User';

// 检查token
export default () => {
  return async (ctx, next) => {
    try {
      const token = ctx.state.user;
      if (token) {
        const user = await User.checkToken(token);
        if (user) {
          ctx.state.userMess = user.toObject();
          await next();
        } else {
          ctx.throw(501, 'token信息异常');
        }
      } else {
        ctx.throw(401, 'token丢失');
      }
    } catch (error) {
      ctx.throw(500, error.message);
    }
  };
};
