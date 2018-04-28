'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import Address from '../../api/models/Address';

describe('Controller: address', () => {
  let user = null;
  let newAddress = Math.random().toString(36).substr(2);
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
  it('Action: getOwnAddress', async () => {
    const result = await request
      .get('/api/auth/address')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
    assert(result.body.data.length !== 0);
  });
  it('Action: addAddress', async () => {
    const result = await request
      .post('/api/auth/address')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        address: newAddress,
        receivePeople: '测试姓名',
        postalCode: '510631',
        receivePhone: '12365487798'
      })
      .expect(200);

    assert(result.body.code === 201);
  });
  it('Action: updateAddress', async () => {
    newAddress = await Address.findOne({ address: newAddress });
    const result = await request
      .put(`/api/auth/address/${newAddress.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        address: '测试地址',
        receivePeople: '随便写的',
        postalCode: '528456',
        receivePhone: '11111111111'
      })
      .expect(200);
    newAddress = await Address.findById(newAddress.id);
    assert(result.body.code === 200);
    assert(newAddress.receivePhone === '11111111111');
  });
  it('Action: deleteAddress', async () => {
    await request
      .delete(`/api/auth/address/${newAddress.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);
    newAddress = await Address.findById(newAddress.id);
    assert(newAddress === null);
  });
});
