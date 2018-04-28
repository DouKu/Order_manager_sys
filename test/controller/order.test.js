'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import Order from '../../api/models/Order';
import Goods from '../../api/models/Goods';
import _ from 'lodash';
import Address from '../../api/models/Address';

describe('Controller: Order', () => {
  let user = null;
  // let newAddress = Math.random().toString(36).substr(2);
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    assert(user !== null);
  });
  it('Action: addOrder', async () => {
    const goods = await Goods.find({ name: 'test' });
    const address = await Address.findOne({});
    const goodDeel = _.chain(goods)
      .map(o => {
        return {
          name: o.name,
          price: o.price,
          picture: o.pictures[0] || 'no picture',
          num: 2
        };
      })
      .value();

    const result = await request
      .post('/api/auth/order')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        goods: goodDeel,
        address: address.address,
        receivePeople: address.receivePeople,
        postalCode: address.postalCode,
        receivePhone: address.receivePhone
      })
      .expect(200);

    const newOrder = await Order.findOne().sort({ createAt: -1 });
    assert(result.body.code === 200);
    assert(newOrder.address === address.address);
  });
});
