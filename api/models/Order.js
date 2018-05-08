'use strict';
import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

// 订单表
const OrderSchema = new Schema({
  fromUser: { type: ObjectId, ref: 'User' }, // 下单用户id
  toUser: { type: ObjectId, ref: 'User' }, // 接单用户id
  goods: [{
    name: { type: String, required: true }, // 商品名
    price: { type: Number, required: true }, // 商品单价
    picture: { type: String }, // 图片url
    num: { type: Number, required: true } // 商品数量
  }],
  sumPrice: { type: Number, required: true }, // 总价
  /**
   * 商品状态:
   * 1：已下单，2.已接单，3.已拒绝
   * 4.已出货/已发货
   * 5.交易确认, 6.申请取消，7.已取消
   */
  state: { type: Number, required: true },
  screenshots: { type: String }, // 上传截图
  trackingNumber: { type: String }, // 快递单号
  address: { type: String, required: true }, // 收货详细地址
  receivePeople: { type: String, required: true }, // 收货人姓名
  postalCode: { type: String, required: true }, // 邮政编码
  receivePhone: { type: String, required: true }, // 收货人电话号码
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
