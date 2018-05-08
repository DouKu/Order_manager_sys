'use strict';
import { addMessage } from '../../api/service/message';
import { toObjectId } from '../../api/service/toObjectId';
import assert from 'power-assert';
import UserMessage from '../../api/models/UserMessage';

describe('Service: message', () => {
  it('Action: addMessage', async () => {
    const shotter = await UserMessage.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4010') }
    );
    let data = {
      'type': 3,
      'fromUser': toObjectId('5ae0583e88c08266d47c4009'),
      'title': '系统公告',
      'message': 'lalalal',
      'createAt': Date.now()
    };
    await addMessage(data);
    const longer = await UserMessage.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4010') }
    );
    assert(longer.messages.length > shotter.messages.length);
    let beforeMess = await UserMessage.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4014') }
    );
    beforeMess = beforeMess.messages.length;
    data = {
      'type': 1,
      'fromUser': toObjectId('5ae0583e88c08266d47c4013'),
      'toUser': toObjectId('5ae0583e88c08266d47c4014'),
      'title': '订单消息',
      'message': '你的订单已发货了',
      'createAt': Date.now()
    };
    await addMessage(data);
    let afterMess = await UserMessage.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4014') }
    );
    afterMess = afterMess.messages.length;

    assert(afterMess > beforeMess);
  });
});
