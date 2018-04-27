import mongoose, { Schema } from 'mongoose';

const AddressSchema = new Schema({
  userId: { type: String, required: true }, // 用户id
  address: { type: String, required: true }, // 详细地址
  receivePeople: { type: String, required: true }, // 收货人姓名
  postalCode: { type: String, required: true }, // 邮政编码
  phoneNumber: { type: String, required: true }, // 电话号码
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

AddressSchema.index({ userId: -1 });

export default mongoose.model('Address', AddressSchema);
