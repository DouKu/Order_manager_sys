'use strict';
import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

const LevelupSchema = new Schema({
  applyUser: { type: ObjectId, ref: 'User' }, // 申请用户id
  toUser: { type: ObjectId, ref: 'User' }, // 对应上级
  applyLevel: { type: Number }, // 申请等级
  screenshots: { type: String }, // 收款截图
  deel: { type: Number }, // 处理情况 1.等待处理，2.批准升级，3.拒绝升级
  createAt: { type: Date, default: Date.now() }, // 创建时间
  updateAt: { type: Date } // 更新时间
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

LevelupSchema.index({ createAt: -1 });

export default mongoose.model('Levelup', LevelupSchema);
