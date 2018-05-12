'use strict';
import VCode from '../models/VerificationCode';
import moment from 'moment';

// 删除一个小时前的验证码
export default async () => {
  try {
    const expriedTime = moment().subtract(1, 'hours').format();
    await VCode.deleteMany({}).where('createAt').lt(expriedTime);
    console.log('delete VCode success at', new Date());
  } catch (error) {
    console.log(error.message);
  }
};
