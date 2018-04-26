'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import User from '../../api/models/User';

describe('Controller: recommend', () => {
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
  it('Action: ownRecommend', async () => {
    const result = await request
      .get('/api/auth/recommend')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.length > 0);
  });
  it('Action: findRecommendByUser', async () => {
    const manager = await User.findOne({ realName: '管理员' });
    const result = await request
      .get(`/api/auth/recommend/${manager.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.length === result.body.count);
  });
});
