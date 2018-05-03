'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
// import Configs from '../../api/models/Configs';

describe('Controller: configs', () => {
  let user = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    assert(user !== null);
  });
  it('Action: showConfig', async () => {
    const result = await request
      .get('/api/mana/configs')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.expiredMonths === 12);
  });
  it('Action: changeConfig', async () => {
    const result = await request
      .post('/api/mana/configs')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        expiredMonths: 13
      })
      .expect(200);

    assert(result.body.data.expiredMonths === 13);
  });
});
