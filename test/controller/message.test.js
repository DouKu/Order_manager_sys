'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import UserMessage from '../../api/models/UserMessage';

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
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });
    const result = await request
      .get('/api/auth/messAll')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
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
      .get('/api/auth/mess/5ae6b8d5c972c50f86f70005')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.data.messages.length === 3);
    assert(!('5ae6b8d5c972c50f86f70005' in result.body.data.messages));
  });
});
