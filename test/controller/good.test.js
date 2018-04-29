'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';

describe.only('Controller: goods', () => {
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
  it('Action: addGoods', async () => {
    const result = await request
      .post('/api/auth/goods')
      .send({
        name: 'lucky',
        price: 16,
        picture: ['asdasdas'],
        des: 'aaaaaaaaaaa',
        target: 1
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });

  it('Action: getGoodsByTarget', async () => {
    const result = await request
      .get('/api/auth/goods/target?target=1')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });

  it('Action: getGoodsByName', async () => {
    const result = await request
      .get('/api/auth/goods/name?name=lucky')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });

  it('Action: deleteGoods', async () => {
    const result = await request
      .delete('/api/auth/goods?name=lucky')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });

  it('Action: updatedGoodsPrice', async () => {
    const result = await request
      .post('/api/auth/goods/update/price')
      .send({
        id: '5ae3e822c3dab11784de07a7',
        price: 21
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });

  it('Action: updatedGoodsInfo', async () => {
    const result = await request
      .post('/api/auth/goods/update/info')
      .send({
        name: 'lucky',
        info: {
          des: 'rrrrrrrrrrr',
          pictures: ['asd', 'ads']
        }
      })
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
});
