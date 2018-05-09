'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import UserMessage from '../../api/models/UserMessage';
import { toObjectId } from '../../api/service/toObjectId';

describe('Controller: message', () => {
  let user = null;
  it('Action: getUnReadMess', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '111111111',
        password: '123456789',
        target: 1
      });
    const result = await request
      .get('/api/auth/mess')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data[0].createAt >= result.body.data[1].createAt);
  });
  it('Action: getAllMess', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '222222222',
        password: '123456789',
        target: 1
      });
    let result = await request
      .post('/api/auth/messAll')
      .send({
        page: 1,
        limit: 5
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.length === 5);

    result = await request
      .post('/api/auth/messAll')
      .send({
        page: 1,
        limit: 3
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.length === 3);
    assert(result.body.count >= result.body.data.length);
  });
  it('Action: readMess', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '111111111',
        password: '123456789',
        target: 1
      });

    let userMessage = await UserMessage.findOne({ userId: '5ae0583e88c08266d47c4011' });
    assert(userMessage.messages.length === 4);

    const result = await request
      .put('/api/auth/mess/5ae6b8d5c972c50f86f70005')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: messDetail', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '111111111',
        password: '123456789',
        target: 1
      });

    const result = await request
      .get('/api/auth/mess/5ae6b8d5c972c50f86f70005')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.type === 2);
  });
  it('Action: readAll', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '111111111',
        password: '123456789',
        target: 1
      });

    let result = await request
      .get('/api/auth/messClean')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    result = await UserMessage.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4011') }
    );
    assert(result.messages.length === 0);
  });
  it('Action: announcement', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 2
      });

    const result = await request
      .post('/api/mana/announcement')
      .send({
        title: '测试系统公告',
        message: '测试测试测试测试，unit test！！！！！'
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
});
