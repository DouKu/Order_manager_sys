'use strict';
import { request } from '../bootstrap.test';
import assert from 'power-assert';
import User from '../../api/models/User';
import LevelUp from '../../api/models/Levelup';
import Recommend from '../../api/models/Recommend';
import { toObjectId } from '../../api/service/toObjectId';
import UserMessage from '../../api/models/UserMessage';
import Summary from '../../api/models/Summary';

describe('Controller: user', () => {
  let user = null;
  const newMessage = Math.random().toString(36).substr(2);
  before('login', async () => {
    user = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      })
      .expect(200);

    assert(user !== null);
  });
  it('Action: register', async () => {
    const idCard = `${Date.now()}${newMessage}4432165`.slice(0, 18);
    const manager = await User.findOne({ realName: '管理员' });
    let result = await request
      .post('/api/v1/register')
      .send({
        phoneNumber: newMessage,
        password: newMessage,
        realName: newMessage,
        idCard: idCard,
        managerId: manager.id,
        recommendId: manager.id
      })
      .expect(200);
    const newUser = await User.findOne({ realName: newMessage });
    const newRec = await Recommend.findOne({ toUser: toObjectId(newUser.id) });
    assert(newUser !== null);
    assert(result.body.code === 200);
    assert(newRec.fromUser.toString() === manager.id);

    // 注册失败
    result = await request
      .post('/api/v1/register')
      .send({
        phoneNumber: newMessage,
        password: newMessage,
        realName: newMessage,
        idCard: idCard,
        managerId: manager.id,
        recommendId: manager.id
      })
      .expect(200);
    assert(result.body.code === 400);
  });
  it('Action: getUserInfo', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '987654321',
        password: '123456789',
        target: 1
      })
      .expect(200);
    assert(login.body.id !== null);
    const result = await request
      .get('/api/auth/user')
      .set({ Authorization: `Bearer ${login.body.token}` })
      .expect(200);

    assert(result.body.data.manager === '管理员');
    assert(result.body.data.messageUnRead > 0);
  });
  it('Action: lockUser', async () => {
    await request
      .put('/api/mana/user/5ae0583e88c08266d47c4014')
      .send({
        isLock: true
      })
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(200);

    let lockUser = await User.findById('5ae0583e88c08266d47c4014');
    assert(lockUser.isLock === true);

    await request
      .put('/api/mana/user/5ae0583e88c08266d47c4014')
      .send({
        isLock: false
      })
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(200);
    lockUser = await User.findById('5ae0583e88c08266d47c4014');
    assert(lockUser.isLock === false);
  });
  it('Action: getBubordinate', async () => {
    let result = await request
      .get('/api/auth/subUser/5ae0583e88c08266d47c4012')
      .set({ Authorization: `Bearer ${user.body.token}` })
      .expect(200);

    assert(result.body.code === 200);
  });
  it('Action: listUser', async () => {
    let result = await request
      .post('/api/mana/user/list')
      .set({ Authorization: `Bearer ${user.body.token}` })
      .send({
        page: 1,
        limit: 20,
        conditions: {},
        sort: {
          level: -1
        }
      })
      .expect(200);

    assert(result.body.data.length === 7);
    assert(result.body.data[0].level > result.body.data[1].level);

    result = await request
      .post('/api/mana/user/list')
      .set({ Authorization: 'Bearer ' + user.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          level: 6,
          realName: '测试黄金代理',
          _id: '5ae0583e88c08266d47c4014'
        },
        sort: {
          createAt: 1
        }
      })
      .expect(200);

    assert(result.body.data[0].level === 6);
  });
  it('Action: newUser', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });
    let result = await request
      .post('/api/mana/user')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        phoneNumber: '1325343257',
        password: '123456789',
        nickname: 'wtf',
        realName: 'WTF',
        idCard: '544567576315778524',
        level: 5,
        avatar: 'SDFKJDSLKJF',
        sign: 'what the fuck with that?',
        managerId: '5ae0583e88c08266d47c4012',
        isManager: false
      })
      .expect(200);

    assert(result.body.code === 200);
    const newUser = await User.findOne({ phoneNumber: 1325343257 });
    // 成功生成信息表
    const userMessage = await UserMessage.findOne({ userId: newUser.id });
    assert(userMessage !== null);
    // 成功生成统计表
    const summary = await Summary.findOne({ user: newUser.id });
    assert(summary !== null);

    // 失败的生成
    result = await request
      .post('/api/mana/user')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        phoneNumber: '1325343256',
        password: '123456789',
        nickname: 'wtf',
        realName: 'WTF',
        idCard: '544567576315778564',
        level: 3,
        avatar: 'SDFKJDSLKJF',
        sign: 'what the fuck with that?',
        managerId: '5ae0583e88c08266d47c4012',
        isManager: false
      })
      .expect(200);

    assert(result.body.code === 400);
  });
  it('Action: levelUp', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '444444444',
        password: '123456789',
        target: 1
      });
    // 等级不符失败申请
    let result = await request
      .post('/api/auth/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        level: 6,
        screenshots: 'laksdjflkasjdfl'
      })
      .expect(200);
    assert(result.body.code === 400);
    // 成功申请
    result = await request
      .post('/api/auth/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        level: 5,
        screenshots: 'laksdjflkasjdfl'
      })
      .expect(200);
    assert(result.body.code === 200);
    // 重复申请导致失败
    result = await request
      .post('/api/auth/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        level: 5,
        screenshots: 'laksdjflkasjdfl'
      })
      .expect(200);
    assert(result.body.code === 400);
  });
  it('Action: checkLevel', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '444444444',
        password: '123456789',
        target: 1
      });

    let result = await request
      .get('/api/auth/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .expect(200);

    assert(result.body.data.length === 1);
  });
  it('Action: checkSubLevel', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '333333333',
        password: '123456789',
        target: 1
      });

    let result = await request
      .get('/api/auth/sublevel')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .expect(200);

    assert(result.body.data.length === 1);
  });
  it('Action: listLevel', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });
    let result = await request
      .post('/api/mana/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {},
        sort: {}
      });

    assert(result.body.code === 200);

    // 条件搜索
    result = await request
      .post('/api/mana/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          deel: 1,
          applyUser: '5ae0583e88c08266d47c4014'
        },
        sort: {}
      });

    assert(result.body.data.length > 0);

    // 空搜索
    result = await request
      .post('/api/mana/level')
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        page: 1,
        limit: 20,
        conditions: {
          deel: 2,
          applyUser: '5ae0583e88c08266d47c4013'
        },
        sort: {}
      });

    assert(result.body.data.length === 0);
  });
  it('Action: deelLevelCheck', async () => {
    const login = await request
      .post('/api/v1/login')
      .send({
        phoneNumber: '123456789',
        password: '123456789',
        target: 1
      });

    let levelMess = await LevelUp.findOne(
      { applyUser: toObjectId('5ae0583e88c08266d47c4014') }
    );
    let fontMessNum = await UserMessage.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4014')
    });
    fontMessNum = fontMessNum.messages.length;
    // 拒绝升级
    let result = await request
      .put('/api/mana/level/' + levelMess.id)
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        deel: 3
      })
      .expect(200);

    let afterMessNum = await UserMessage.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4014')
    });
    afterMessNum = afterMessNum.messages.length;
    let userM = await User.findById('5ae0583e88c08266d47c4014');
    // 用户消息增加
    assert(afterMessNum > fontMessNum);
    // 没有升级
    assert(userM.level === 6);
    assert(result.body.code === 200);

    // 同意升级
    fontMessNum = await UserMessage.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4014')
    });
    fontMessNum = fontMessNum.messages.length;
    result = await request
      .put('/api/mana/level/' + levelMess.id)
      .set({ Authorization: 'Bearer ' + login.body.token })
      .send({
        deel: 2
      })
      .expect(200);

    afterMessNum = await UserMessage.findOne({
      userId: toObjectId('5ae0583e88c08266d47c4014')
    });
    afterMessNum = afterMessNum.messages.length;
    userM = await User.findById('5ae0583e88c08266d47c4014');
    // 消息增加
    assert(afterMessNum > fontMessNum);
    // 升级成功
    assert(userM.level === 5);
    assert(result.body.code === 200);
  });
});
