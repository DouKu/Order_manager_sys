import { toObjectId } from '../api/service/toObjectId';
export default [
  {
    '_id': toObjectId('5ae0583e88c08266d47c4009'),
    'isManager': true,
    'appSecret': 'baefa72e7976b83f3347c309bf8fdb715093e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2222-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '123456789',
    'password': '123456789',
    'realName': '管理员',
    'nickname': '管理员',
    'idCard': '441223199912122011',
    'level': 1
  }, {
    '_id': toObjectId('5ae0583e88c08266d47c4010'),
    'isManager': false,
    'appSecret': 'baefa72e7976b83f3347c309bf8fdb715097e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2222-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '987654321',
    'password': '123456789',
    'realName': '测试企业合伙人',
    'nickname': '测试企业合伙人',
    'idCard': '441223199912122012',
    'managerId': toObjectId('5ae0583e88c08266d47c4009'),
    'level': 2
  }, {
    '_id': toObjectId('5ae0583e88c08266d47c4011'),
    'isManager': false,
    'appSecret': 'baefa72e7976b83f3147c309bf8fdb715093e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2222-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '111111111',
    'password': '123456789',
    'realName': '测试执行董事',
    'nickname': '测试执行董事',
    'idCard': '441223199912122013',
    'managerId': toObjectId('5ae0583e88c08266d47c4010'),
    'level': 3
  }, {
    '_id': toObjectId('5ae0583e88c08266d47c4012'),
    'isManager': false,
    'appSecret': 'baefa72e7976183f3147c309bf8fdb715093e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2222-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '222222222',
    'password': '123456789',
    'realName': '测试钻石代理',
    'nickname': '测试钻石代理',
    'idCard': '441223199912122014',
    'managerId': toObjectId('5ae0583e88c08266d47c4011'),
    'level': 4
  }, {
    '_id': toObjectId('5ae0583e88c08266d47c4013'),
    'isManager': false,
    'appSecret': 'baefa72e7976183f3147c309bf8fdb715093e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2222-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '333333333',
    'password': '123456789',
    'realName': '测试白金代理',
    'nickname': '测试白金代理',
    'idCard': '441223199912122015',
    'managerId': toObjectId('5ae0583e88c08266d47c4012'),
    'level': 5
  }, {
    '_id': toObjectId('5ae0583e88c08266d47c4014'),
    'isManager': false,
    'appSecret': 'baefa72e7976183f3147c809bf8fdb715093e25e1b215465a518bb7b73adad61',
    'createAt': Date.now(),
    'expiredAt': new Date('2002-01-01'),
    'updateAt': Date.now(),
    'phoneNumber': '444444444',
    'password': '123456789',
    'realName': '测试黄金代理',
    'nickname': '测试黄金代理',
    'idCard': '441223199912122016',
    'managerId': toObjectId('5ae0583e88c08266d47c4013'),
    'level': 6
  }
];
