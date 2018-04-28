'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';

describe('Controller: goods', () => {
  let user = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });

    assert(user !== null);
  });
  it('Action: addGoods', async () => {
    const result = await request
      .post('/api/auth/goods')
      .send({
        name: 'lucky',
        price: 16,
        picture: ['asdasdas'],
        des: 'aaaaaaaaaaa',
        target: 5
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
});
