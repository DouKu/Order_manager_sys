'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';

describe('Controller: address', () => {
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
  it('Action: getUploadToken', async () => {
    const result = await request
      .get('/api/auth/uploadToken?fileName=lalala')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: upload', async () => {
    const result = await request
      .post('/api/auth/upload')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .attach('file', '/home/qill/MyProject/order-manage-sys/test/files/404.png')
      .expect(200);

    assert(result.body.fsize > 0);
  });
});
