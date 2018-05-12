'use strict';

// 订单im消息筛选
const orderIm = (user, fontState, state, order) => {
  // 若是申请取消状态IM需要不一样
  if (fontState === 6) {
    switch (state) {
      case 2: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '上级拒绝取消订单',
          message: `订单号:${order.id}，上级拒绝了该订单的取消请求，并且该订单已被上级接受`
        };
      }
      case 4: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '上级拒绝取消订单',
          message: `订单号:${order.id}，上级拒绝了该订单的取消请求，并且该订单已被上级发货`
        };
      }
      case 7: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '订单取消成功',
          message: `您的上级同意取消订单，取消的订单号为:${order.id}`
        };
      }
      default : {
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '订单错误',
          message: `您的一个订单，订单号为:${order.id}在处理的时候发生了错误，请联系管理员`
        };
      }
    }
  } else {
    switch (state) {
      case 2: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '上级已接单',
          message: `订单号:${order.id}，已被上级接受`
        };
      }
      case 3: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '订单被拒绝',
          message: `订单号:${order.id}，被上级拒绝，请与相关人员沟通`
        };
      }
      case 4: {
        // im发送到下单人
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '订单已发货',
          message: `订单号:${order.id}，的相关商品已发货请留意物流信息`
        };
      }
      case 5: {
        // im发送到接单人
        return {
          type: 1,
          fromUser: order.fromUser,
          toUser: order.toUser,
          title: '交易确认',
          message: `${user.realName}确认了订单:${order.id}`
        };
      }
      case 6: {
        // im发送到接单人
        return {
          type: 1,
          fromUser: order.fromUser,
          toUser: order.toUser,
          title: '订单申请取消',
          message: `${user.realName}申请取消订单，订单号为:${order.id}，请前往处理`
        };
      }
      default : {
        return {
          type: 1,
          fromUser: order.toUser,
          toUser: order.fromUser,
          title: '订单错误',
          message: `您的一个订单，订单号为:${order.id}在处理的时候发生了错误，请联系管理员`
        };
      }
    }
  }
};

export {
  orderIm
};
