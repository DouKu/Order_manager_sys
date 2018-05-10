import { toObjectId } from '../api/service/toObjectId';

export default [
  {
    '_id': toObjectId('5af33f5a5358f66394ff1334'),
    'user': toObjectId('5ae0583e88c08266d47c4014'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2017-01-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ff2433'),
    'user': toObjectId('5ae0583e88c08266d47c4013'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2017-01-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ff3532'),
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
    'createAt': new Date('2017-01-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ff4631'),
    'user': toObjectId('5ae0583e88c08266d47c4011'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2017-01-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ff5730'),
    'user': toObjectId('5ae0583e88c08266d47c4010'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2017-01-01')
  },
  {
    '_id': toObjectId('5af33f5a5358f66394ff6829'),
    'user': toObjectId('5ae0583e88c08266d47c4009'),
    'goods': [],
    'goodsNum': 0,
    'sumPrice': 0,
    'createAt': new Date('2017-01-01')
  }
];
