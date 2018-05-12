export default [
  { // 可用的验证码
    'use': false,
    'createAt': Date.now(),
    'phone': '15521264574',
    'code': '109500'
  }, { // 过期但没有用的验证码
    'use': false,
    'createAt': new Date('2018-04-01'),
    'phone': '15521264574',
    'code': '109300'
  }, { // 已经用过的验证码
    'use': true,
    'createAt': Date.now(),
    'phone': '15521264574',
    'code': '109200'
  }, { // 可用的验证码
    'use': false,
    'createAt': Date.now(),
    'phone': '123456789',
    'code': '123456'
  }
];
