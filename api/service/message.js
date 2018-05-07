'use strict';
import Message from '../models/Message';
import UserMessage from '../models/UserMessage';

// 添加消息
const addMessage = async data => {
  const newMess = new Message(data);
  await newMess.save();
  if (data.type === 3) {
    await UserMessage.updateMany({}, { $push: { messages: newMess._id } });
  } else {
    await UserMessage.findOneAndUpdate(
      { userId: data.toUser },
      { $push: { messages: newMess._id } }
    );
  }
};

export {
  addMessage
};
