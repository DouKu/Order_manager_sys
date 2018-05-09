'use strict';
import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

// 日度统计表
const SummarySchema = new Schema({
  user: { type: ObjectId, ref: 'User' }, // 用户关联
  goods: [{
    name: { type: String }, // 商品名
    num: { type: Number } // 商品数量
  }],
  goodsNum: { type: Number, default: 0 }, // 总出货量
  sumPrice: { type: Number, default: 0 }, // 总交易额
  createAt: { type: Date } // 创建时间
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

export default mongoose.model('Summary', SummarySchema);
