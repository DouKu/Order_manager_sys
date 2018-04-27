import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

// 订单表
const OrderSchema = new Schema({
  fromUser: { type: ObjectId, ref: 'User' }, // 下单用户id
  toUser: { type: ObjectId, ref: 'User' }, // 接单用户id
  goods: [{
    name: { type: String, required: true }, // 商品名
    price: { type: Number, required: true }, // 商品单价
    pictures: { type: String }, // 图片url
    num: { type: Number, required: true } // 商品数量
  }],
  sumPrice: { type: Number, required: true }, // 总价
  state: { type: Number, default: 1 }, // 商品状态（1.已下单，2.已出货，3.交易确认）
  trackingNumber: { type: String }, // 快递单号
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

export default mongoose.model('Orders', OrderSchema);
