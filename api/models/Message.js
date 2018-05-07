'use strict';
import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

const MessageSchema = new Schema({
  type: { type: Number }, // 消息类别，1.订单通知，2.用户通知，3.公告
  fromUser: { type: ObjectId, ref: 'User' }, // 发送者id
  toUser: { type: ObjectId, ref: 'Message' }, // 接收者id
  title: { type: String, required: true }, // 消息标题
  message: { type: String, required: true }, // 消息主体
  createAt: { type: Date, default: Date.now() }
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

MessageSchema.index({ createAt: -1 });
MessageSchema.index({ fromUser: -1 });
MessageSchema.index({ toUser: -1 });

export default mongoose.model('Message', MessageSchema);
