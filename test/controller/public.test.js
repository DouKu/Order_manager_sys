'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import Public from '../../api/models/Public';

describe('Controller: public', () => {
  let user = null;
  let newPublic = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 2
      });

    assert(user !== null);
  });
  it('Action: addPublic', async () => {
    const result = await request
      .post('/api/mana/public')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        des: '百度云',
        Link: 'www.alksdjflskdjf',
        pass: '1234564'
      })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: getPublic', async () => {
    const result = await request
      .get('/api/auth/public')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
    assert(result.body.data.length === 1);
  });
  it('Action: updatePublic', async () => {
    newPublic = await Public.findOne({});
    const result = await request
      .put(`/api/mana/public/${newPublic.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        des: '修改描述',
        Link: '随便写的',
        pass: '528456'
      })
      .expect(200);
    assert(result.body.code === 200);
    newPublic = await Public.findOne({});
    assert(newPublic.des === '修改描述');
  });
  it('Action: deletePbulic', async () => {
    await request
      .delete(`/api/mana/public/${newPublic.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);
    newPublic = await Public.findById(newPublic.id);
    assert(newPublic === null);
  });
});
