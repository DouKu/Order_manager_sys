'use strict';
import { addMessage } from './message';

// 审核代理时按照申请类别发送通知
const sendLevelUpMess = async (deel, type, fromUser, toUser, userAgent) => {
  const mess = {
    type: 2,
    fromUser: fromUser,
    toUser: toUser
  };
  // 类别区分激活与升级, 1.升级，2.激活
  if (type === 1) {
    mess.title = '升级申请审核';
    if (deel === 2) {
      mess.message = `您的${userAgent.des}升级申请以被同意，恭喜您经成为${userAgent.des}！`;
    } else if (deel === 3) {
      mess.message = `您的${userAgent.des}升级申请被管理员拒绝，请继续努力！`;
    }
  } else if (type === 2) {
    mess.title = '激活申请审核';
    if (deel === 2) {
      mess.message = `您申请激活为:${userAgent.des}的请求已被管理员通过，恭喜您经成为${userAgent.des}！`;
    } else if (deel === 3) {
      mess.message = `您申请激活为:${userAgent.des}的申请被管理员拒绝，请联系管理员。`;
    }
  }
  console.log(mess);
  await addMessage(mess);
};

export {
  sendLevelUpMess
};
