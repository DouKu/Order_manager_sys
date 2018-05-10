'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import moment from 'moment';
import Order from '../../api/models/Order';
import Goods from '../../api/models/Goods';
import orderData from '../../script/orderData';
import Summary from '../../api/models/Summary';
import _ from 'lodash';
import Address from '../../api/models/Address';
import UserMess from '../../api/models/UserMessage';
import { toObjectId } from '../../api/service/toObjectId';
import { getdate } from '../../api/service/countDate';

describe('Controller: Order', () => {
  let user = null;
  // let newAddress = Math.random().toString(36).substr(2);
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
  it('Action: checkMyOrder', async () => {
    let user2 = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    let result = await request
      .post('/api/auth/order/checkOrder')
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {}
      })
      .expect(200);

    assert(result.body.data.length > 0);
    assert(result.body.data.length < orderData.length);

    const endDate = moment('2018-03-30').format('YYYY-MM-DD HH:mm:ss');
    result = await request
      .post('/api/auth/order/checkOrder')
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          endDate,
          state: 8
        }
      })
      .expect(200);

    assert(result.body.data[0].state === 8);
  });
  it('Action: checkMyBill', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });

    let result = await request
      .post('/api/auth/order/checkBill')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        page: 1,
        limit: 3,
        conditions: {}
      })
      .expect(200);

    assert(result.body.data.length > 0);
    assert(result.body.data.length < orderData.length);
    assert(result.body.count >= result.body.data.length);
  });
  it('Action: addOrder', async () => {
    let user2 = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      });

    const goods = await Goods.find();
    const address = await Address.findOne({});
    const goodDeel = _.chain(goods)
      .map(o => {
        return {
          name: o.name,
          price: Math.ceil(Math.random() * 100),
          picture: o.pictures[0] || 'no picture',
          num: 2
        };
      })
      .value();

    // 计算下单前im数量
    let beforeMess = await UserMess.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4009') }
    );
    beforeMess = beforeMess.messages.length;

    const result = await request
      .post('/api/auth/order')
      .set({ Authorization: 'Bearer ' + user2.body.token })
      .send({
        goods: goodDeel,
        screenshots: 'lalalalla',
        address: address.address,
        receivePeople: address.receivePeople,
        postalCode: address.postalCode,
        receivePhone: address.receivePhone
      })
      .expect(200);

    const newOrder = await Order.findOne().sort({ createAt: -1 });
    // 计算下单后im数量
    let afterMess = await UserMess.findOne(
      { userId: toObjectId('5ae0583e88c08266d47c4009') }
    );
    afterMess = afterMess.messages.length;
    assert(result.body.code === 200);
    assert(newOrder.address === address.address);
    assert(afterMess > beforeMess);
  });
  it('Action: markOrder', async () => {
    // 标记发货
    let result = await request
      .put(`/api/auth/order/5ae56c3e59551115b3d3a177`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        state: 4,
        trackingNumber: '13246548'
      })
      .expect(200);

    assert(result.body.data.state === 4);

    // 标记发货没有快递单号，标记失败
    result = await request
      .put(`/api/auth/order/5ae56c3e59551115b3d3a166`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        state: 4
      })
      .expect(200);

    assert(result.body.code === 400);

    // 标记接单不需要快递单号，标记成功
    result = await request
      .put(`/api/auth/order/5ae56c3e59551115b3d3a166`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        state: 2
      })
      .expect(200);

    assert(result.body.data.state === 2);

    // 标记已交易确认会添加数据到统计表
    const date = getdate();

    let lessLength = await Summary.findOne(
      { user: toObjectId('5ae0583e88c08266d47c4010') }
    )
      .where('createAt').gte(date.dayBegin).lte(date.dayEnd);

    lessLength = lessLength.goods.length;
    result = await request
      .put(`/api/auth/order/5ae56c3e59551115b3d3a166`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        state: 5
      })
      .expect(200);

    let summary = await Summary.findOne(
      { user: toObjectId('5ae0583e88c08266d47c4010') }
    )
      .where('createAt').gte(date.dayBegin).lte(date.dayEnd);
    let bigLength = summary.goods.length;
    assert(bigLength > lessLength);
    assert(summary.sumPrice > 0);
  });
  it('Action: listOrder', async () => {
    // 条件查询
    let result = await request
      .post('/api/mana/order/list')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          state: 8
        },
        sort: {}
      });

    assert(result.body.data[0].state === 8);

    result = await request
      .post('/api/mana/order/list')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2018-05-02').format('YYYY-MM-DD hh:mm:ss')
        },
        sort: {}
      });

    assert(result.body.data.length === 2);

    result = await request
      .post('/api/mana/order/list')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          beginDate: moment('2018-05-02').format('YYYY-MM-DD hh:mm:ss'),
          endDate: moment().add(1, 'days').format('YYYY-MM-DD hh:mm:ss')
        },
        sort: {
          createAt: 1
        }
      })
      .expect(200);

    const fontDate = new Date(result.body.data[0].createAt);
    const backDate = new Date(result.body.data[1].createAt);
    assert(fontDate < backDate);
  });
  it('Action: orderDetail', async () => {
    const result = await request
      .get(`/api/mana/order/5ae56c3e59551115b3d3a177`)
      .set({ Authorization: 'Bearer ' + user.body.token })
      .expect(200);

    assert(result.body.code === 200);
  });
});
