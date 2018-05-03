'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import User from '../../api/models/User';
import Recommend from '../../api/models/Recommend';
import { toObjectId } from '../../api/service/toObjectId';

describe('Controller: user', () => {
  let user = null;
  const newMessage = Math.random().toString(36).substr(2);
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      })
      .expect(200);

    assert(user !== null);
  });
  it('Action: register', async () => {
    const idCard = `${Date.now()}${newMessage}4432165`.slice(0, 18);
    const manager = await User.findOne({ realName: '管理员' });
    const result = await request
      .post('/api/v1/register')
      .send({
        phoneNumber: newMessage,
        password: newMessage,
        realName: newMessage,
        idCard: idCard,
        managerId: manager.id,
        recommendId: manager.id
      })
      .expect(200);
    const newUser = await User.findOne({ realName: newMessage });
    const newRec = await Recommend.findOne({ toUser: toObjectId(newUser.id) });
    assert(newUser !== null);
    assert(result.body.code === 200);
    assert(newRec.fromUser.toString() === manager.id);
  });
  it('Action: getUserInfo', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      })
      .expect(200);
    assert(login.body.id !== null);
    const result = await request
      .get('/api/auth/user')
      .set({ Authorization: `Bearer ${login.body.token}` })
      .expect(200);

    assert(result.body.data.manager === '管理员');
  });
  it('Action: lockUser', async () => {
    await request
      .put('/api/mana/user/5ae0583e88c08266d47c4014')
      .send({
        isLock: true
      })
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(200);

    const lockUser = await User.findById('5ae0583e88c08266d47c4014');
    assert(lockUser.isLock === true);
  });
});
