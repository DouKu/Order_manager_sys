import mongoose, { Schema } from 'mongoose';

const RecommendSchema = new Schema({
  fromUserId: { type: String, required: true }, // 被推荐人id
  toUserId: { type: String, required: true }, // id
  fromUser: {
    nickname: { type: String }, // 昵称
    realName: { type: String, required: true }, // 姓名
    avatar: { type: String }, // 头像
    managerId: { type: String } // 上级id
  }, // 推荐人
  toUser: {
    nickname: { type: String }, // 昵称
    realName: { type: String, required: true }, // 姓名
    avatar: { type: String }, // 头像
    managerId: { type: String } // 上级id
  }, // 被推荐人
  createAt: { type: Date, default: Date.now() } // 创建时间
}, {
  versionKey: false,
  toJSON: {
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
