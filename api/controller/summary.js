'use strict';
import Summary from '../models/Summary';
import moment from 'moment';
import _ from 'lodash';
import { toObjectId } from '../service/toObjectId';
import { getdate } from '../service/countDate';

// 查询日业绩统计
const getSummaryByDay = async ctx => {
  ctx.verifyParams({
    page: 'int',
    limit: 'int',
    conditions: {
      type: 'object',
      rule: {
        beginDate: { type: 'datetime', required: false },
        endDate: { type: 'datetime', required: false },
        user: { type: 'string', required: false }
      }
    },
    sort: {
      type: 'object',
      rule: {
        createAt: { type: 'enum', values: [-1, 1], required: false },
        goodsNum: { type: 'enum', values: [-1, 1], required: false }
      }
    }
  });
  const body = ctx.request.body;
  const endDate = getdate(body.conditions.endDate).dayEnd;
  let beginDate = body.conditions.beginDate || moment('1971-01-01').format();
  beginDate = getdate(beginDate).dayBegin;
  const skip = (body.page - 1) * body.limit;
  const conditions = _.omit(body.conditions, ['beginDate', 'endDate']);
  const sort = Object.assign({
    createAt: -1,
    goodsNum: -1
  }, body.sort);
  if (conditions.user) {
    conditions.user = toObjectId(conditions.user);
  }

  let data = await Summary.find(conditions)
    .where('createAt').gte(beginDate).lte(endDate)
    .populate('user', 'realName level')
    .sort(sort)
    .skip(skip)
    .limit(body.limit);

  const count = await Summary.count(conditions)
    .where('createAt').gte(beginDate).lte(endDate);

  data = _.chain(data)
    .map(o => {
      return {
        id: o.id,
        userName: o.user.realName,
        userLevel: o.user.level,
        userId: o.user.id,
        goods: o.goods,
        goodsNum: o.goodsNum,
        sumPrice: o.sumPrice,
        createAt: o.createAt
      };
    })
    .value();

  ctx.body = {
    code: 200,
    data,
    count
  };
};

export {
  getSummaryByDay
};
