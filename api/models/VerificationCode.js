'use strict';
import mongoose, { Schema } from 'mongoose';

const VerificationCodeSchema = new Schema({
  phone: { type: String, required: true }, // 用户id
  code: { type: String, required: true }, // 验证码
  use: { type: Boolean, default: false }, // 是否已用
  createAt: { type: Date, default: Date.now() } // 创建时间
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

VerificationCodeSchema.index({ user: 1, createAt: -1 });

export default mongoose.model('VerificationCode', VerificationCodeSchema);
