'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
// import moment from 'moment';

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
  it('Action: getSummaryByDay', async () => {
    let result = await request
      .post('/api/mana/dsummary')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {},
        sort: {}
      });
    assert(result.body.data.length > 0);
  });
});
