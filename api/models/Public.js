import mongoose, { Schema } from 'mongoose';

const PublicSchema = new Schema({
  des: { type: String, required: true }, // 描述
  Link: { type: String, required: true }, // 网盘连接
  pass: { type: String, required: true } // 网盘密码
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

export default mongoose.model('Public', PublicSchema);
