'use strict';
import mongoose, { Schema } from 'mongoose';

// 商品信息表
const GoodsSchema = new Schema({
  name: { type: String, required: true, unique: true }, // 商品名
  price: { type: Number, default: 0 }, // 商品基础价格
  pictures: [{ type: String }], // 图片地址
  des: { type: String }, // 商品描述
  strategies: [{
    agent: { type: Number }, // 代理等级
    price: { type: Number } // 商品额外价格
  }], // 商品价格
  createAt: { type: Date, default: Date.now() }, // 创建时间
  updateAt: { type: Date, default: Date.now() } // 更新时间
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

export default mongoose.model('Goods', GoodsSchema);
