'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import User from '../../api/models/User';

describe('Controller: user', () => {
  it('Action: login', async () => {
    const result = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: register', async () => {
    const manager = await User.findOne({ realName: '管理员' });
    const result = await request
      .post('/api/v1/register')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        realName: 'abc',
        idCard: '441223199912122012',
        managerId: manager.id,
        recommendId: manager.id
      })
      .expect(200);
    const newUser = await User.findOne({ realName: 'abc' });
    assert(newUser !== null);
    assert(result.body.code === 200);
    await User.deleteOne({ realName: 'abc' });
  });
});
