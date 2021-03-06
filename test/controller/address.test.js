'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import Address from '../../api/models/Address';
import { toObjectId } from '../../api/service/toObjectId';

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

    assert(result.body.code === 200);
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
  it('Action: changeDefault', async () => {
    const falseAddress = await Address.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4009'),
      isDefault: false
    });
    const defaultAddress = await Address.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4009'),
      isDefault: true
    });
    await request
      .put(`/api/auth/address/default/${falseAddress.id}`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    const changeAddress = await Address.find({
      userId: toObjectId('5ae0583e88c08266d47c4009'),
      isDefault: true
    });

    assert(changeAddress.id !== defaultAddress.id);
    assert(changeAddress.length === 1);
    assert(changeAddress[0].isDefault === true);
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
