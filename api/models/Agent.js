import mongoose, { Schema } from 'mongoose';

// 代理信息表
const AgentSchema = new Schema({
  level: { type: Number, required: true, unique: true }, // 代理等级（1.企业合伙人，2.执行董事）
  tag: { type: String, required: true }, // 代理标签
  des: { type: String, required: true }, // 代理描述
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

export default mongoose.model('Agent', AgentSchema);
