import { toObjectId } from '../api/service/toObjectId';

export default [
  {
    '_id': toObjectId('5af33f5a5358f66394ffe334'),
    'user': toObjectId('5ae0583e88c08266d47c4014'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2018-04-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe433'),
    'user': toObjectId('5ae0583e88c08266d47c4013'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2018-04-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe532'),
    'user': toObjectId('5ae0583e88c08266d47c4012'),
    'goods': [
      {
        'name': 'test',
        'num': 10
      },
      {
        'name': 'test1',
        'num': 10
      }
    ],
    'goodsNum': 20,
    'sumPrice': 1050,
    'createAt': new Date('2018-04-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe631'),
    'user': toObjectId('5ae0583e88c08266d47c4011'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2018-04-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe730'),
    'user': toObjectId('5ae0583e88c08266d47c4010'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2018-04-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe829'),
    'user': toObjectId('5ae0583e88c08266d47c4009'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2018-04-01') },

  {
    '_id': toObjectId('5af33f5a5358f66394ffe234'),
    'user': toObjectId('5ae0583e88c08266d47c4014'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe233'),
    'user': toObjectId('5ae0583e88c08266d47c4013'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe232'),
    'user': toObjectId('5ae0583e88c08266d47c4012'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe231'),
    'user': toObjectId('5ae0583e88c08266d47c4011'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe230'),
    'user': toObjectId('5ae0583e88c08266d47c4010'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ffe229'),
    'user': toObjectId('5ae0583e88c08266d47c4009'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': Date.now()
  }
];
