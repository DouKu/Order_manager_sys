'use strict';
import mongoose, { Schema } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import nconf from 'nconf';
const ObjectId = Schema.Types.ObjectId;
const saltRound = 10;

// 用户表
const UserSchema = new Schema({
  phoneNumber: { type: String, required: true, unique: true }, // 登录名(电话)
  password: { type: String }, // 密码(加盐哈希)
  nickname: { type: String }, // 昵称
  realName: { type: String, required: true }, // 真实名称
  idCard: {
    type: String,
    required: true,
    unique: true,
    minlength: 18,
    maxlength: 18
  }, // 身份证
  level: { type: Number, required: true, default: 5 }, // 用户代理等级
  avatar: { type: String }, // 头像
  sign: { type: String }, // 个性签名
  managerId: { type: ObjectId, ref: 'User' }, // 上级id
  isManager: { type: Boolean, default: false }, // 是否为管理员
  appSecret: { type: String, default: GetHmac() }, // token用
  isLock: { type: Boolean, default: false }, // 是否封号
  isActive: { type: Boolean, default: false }, // 是否激活
  createAt: { type: Date, default: Date.now() }, // 创建时间
  expiredAt: { type: Date }, // 过期时间
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

UserSchema.index({ realName: 1 });
UserSchema.index({ phoneNumber: -1 });
UserSchema.index({ managerId: -1 });

function GetHmac (params) {
  const hmac = crypto.createHmac('sha256', nconf.get('secret_key'));
  hmac.update(Date.now().toString());
  return hmac.digest('hex');
}

UserSchema.pre('save', async function (next) {
  try {
    const user = this;
    if (!user.isModified('password')) return next();
    const salt = await bcrypt.genSalt(saltRound);
    const hash = await bcrypt.hash(this.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.methods.comparePassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

UserSchema.statics.checkToken = async function (token) {
  const user = await this.findById(token.id);
  if (token.secret === user.appSecret) {
    return user;
  } else {
    throw Error('验证未通过!');
  }
};

UserSchema.statics.checkAndUpdateToken = async function (token) {
  const secret = GetHmac();
  // const user = await this.findOne({ _id: token.id })
  const user = await this.findOneAndUpdate(
    { _id: token.id },
    { appSecret: secret }
  );
  if (token.secret === user.appSecret) {
    user.appSecret = secret;
    return user;
  } else {
    throw Error('验证未通过!');
  }
};

export default mongoose.model('User', UserSchema);
