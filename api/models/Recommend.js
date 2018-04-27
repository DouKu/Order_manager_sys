import mongoose, { Schema } from 'mongoose';
const ObjectId = Schema.Types.ObjectId;

// 推荐信息表
const RecommendSchema = new Schema({
  fromUser: { type: ObjectId, ref: 'User' }, // 被推荐人id
  toUser: { type: ObjectId, ref: 'User' }, // id
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

RecommendSchema.index({ fromUserId: -1 });
RecommendSchema.index({ toUserId: -1 });
RecommendSchema.index({ createAt: -1 });

export default mongoose.model('Recommend', RecommendSchema);
