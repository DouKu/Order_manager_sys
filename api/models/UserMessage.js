'use strict';
import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

const UserMessageSchema = new Schema({
  userId: { type: ObjectId, ref: 'User' }, // 用户id
  messages: [{ type: ObjectId, ref: 'Message' }]// 消息id
}, {
  versionKey: false,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  },
  toObject: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

export default mongoose.model('UserMessage', UserMessageSchema);
