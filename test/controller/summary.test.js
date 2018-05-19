'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import moment from 'moment';

describe('Controller: summary', () => {
  let user = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });

    assert(user.body !== null);
  });
  it('Action: getDaysSummary', async () => {
    let result = await request
      .post('/api/mana/dsummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2018-05-06').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length > 0);
  });
  it('Action: getMonthSummary', async () => {
    let result = await request
      .post('/api/mana/msummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2018-04-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-04-01').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 6);
  });
  it('Action: getYearSummary', async () => {
    let result = await request
      .post('/api/mana/ysummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-01-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-01-01').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length >= 12);
  });
  it('Action: getOwnDaySummary', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    // 不在范围内
    let result = await request
      .post('/api/auth/dsummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-01-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-05-06').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 0);

    // 两天两条
    result = await request
      .post('/api/auth/dsummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-04-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment().format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 2);
  });
  it('Action: getOwnMonthSummary', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });
    // 不在范围内
    let result = await request
      .post('/api/auth/msummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-01-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-01-01').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 0);

    // 两个月两条
    result = await request
      .post('/api/auth/msummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-04-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-05-01').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 2);
  });
  it('Action: getOwnYearSummary', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    let result = await request
      .post('/api/auth/ysummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2017-01-01').format('YYYY-MM-DD 00:00:00'),
          endDate: moment('2018-01-01').format('YYYY-MM-DD 00:00:00')
        },
        sort: {}
      });
    assert(result.body.data.length === 2);
  });
});
