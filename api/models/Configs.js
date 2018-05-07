'use strict';
import mongoose, { Schema } from 'mongoose';

// 公共配置表
const ConfigsSchema = new Schema({
  expiredMonths: { type: Number, required: true } // 账户默认过期时间
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

export default mongoose.model('Configs', ConfigsSchema);
