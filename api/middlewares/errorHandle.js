'use strict';

export default () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.body = {
        code: error.status || 500,
        error: error.message
      };
    }
  };
};
