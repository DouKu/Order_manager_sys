import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

// 商品价格策略表
const GoodsPriceSchema = new Schema({
  goods: { type: ObjectId, ref: 'Goods', unique: true }, // 商品关联
  strategies: [{
    agent: { type: Number }, // 代理等级
    price: { type: Number } // 商品额外价格
  }] // 商品价格
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

export default mongoose.model('GoodsPrice', GoodsPriceSchema);
