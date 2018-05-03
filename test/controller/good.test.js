'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import _ from 'lodash';
import Goods from '../../api/models/Goods';

describe('Controller: goods', () => {
  let user = null;
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    assert(user.body !== null);
  });
  it('Action: addGoods', async () => {
    const result = await request
      .post('/api/mana/goods')
      .send({
        name: 'lucky',
        pictures: ['asdasdas'],
        des: 'aaaaaaaaaaa',
        strategies: [
          {
            agent: 1,
            price: 10
          }, {
            agent: 2,
            price: 20
          }, {
            agent: 3,
            price: 40
          }, {
            agent: 4,
            price: 50
          }, {
            agent: 5,
            price: 60
          }, {
            agent: 6,
            price: 70
          }
        ]
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: getGoods', async () => {
    const user2 = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });
    let result = await request
      .get('/api/auth/goods')
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .expect(200);

    assert(result.body.code === 200);
    const smallPrice = _.filter(result.body.data, { name: 'test' })[0].price;
    result = await request
      .get('/api/auth/goods')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);
    const biggerPrice = _.filter(result.body.data, { name: 'test' })[0].price;
    assert(biggerPrice > smallPrice);
  });
  it('Action: getAllGoods', async () => {
    let result = await request
      .get('/api/mana/goods/all')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: updatedMess', async () => {
    let luckyGood = await Goods.findOne({ name: 'lucky' });
    const result = await request
      .put('/api/mana/goods/' + luckyGood.id)
      .send({
        name: 'luuuuu',
        des: 'bbbbbbbbb',
        pictures: ['aaaaaa', 'bbbbbbb', 'cccccccc'],
        strategies: [
          {
            agent: 1,
            price: 50
          }, {
            agent: 2,
            price: 100
          }, {
            agent: 3,
            price: 150
          }, {
            agent: 4,
            price: 200
          }, {
            agent: 5,
            price: 250
          }, {
            agent: 6,
            price: 300
          }
        ]
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
    luckyGood = await Goods.findById(luckyGood.id);
    assert(luckyGood.name === 'luuuuu');
    assert(luckyGood.pictures.length > 0);
    assert(luckyGood.pictures.length === 3);
  });
  it('Action: checkProfit', async () => {
    const result = await request
      .get('/api/auth/goods/profit')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: deleteGoods', async () => {
    await request
      .post('/api/mana/goods')
      .send({
        name: 'lucky2',
        pictures: ['asdasdas'],
        des: 'aaaaaaaaaaa',
        strategies: [
          {
            agent: 1,
            price: 10
          }, {
            agent: 2,
            price: 20
          }, {
            agent: 3,
            price: 40
          }, {
            agent: 4,
            price: 50
          }, {
            agent: 5,
            price: 60
          }, {
            agent: 6,
            price: 70
          }
        ]
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    const luckyGood = await Goods.findOne({ name: 'lucky2' });
    const result = await request
      .delete('/api/mana/goods/' + luckyGood.id)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
});
