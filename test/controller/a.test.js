import mongoose from 'mongoose';
import assert from 'power-assert';
import daySummary from '../../api/schedule/daySummary';
import monthSummary from '../../api/schedule/monthSummary';
import yearSummary from '../../api/schedule/yearSummary';
import deleteVcode from '../../api/schedule/deleteVcode';

// import data
import agentData from '../../script/agentData';
import userData from '../../script/userData';
import recommendData from '../../script/recommendData';
import goodsData from '../../script/goodsData';
import addressData from '../../script/addressData';
import orderData from '../../script/orderData';
import ConfigsData from '../../script/ConfigsData';
import messageData from '../../script/messageData';
import userMessData from '../../script/userMessData';
import summaryData from '../../script/summaryData';
import msummaryData from '../../script/msummaryData';
import ysummaryData from '../../script/ysummaryData';
import vcodeData from '../../script/vcodeData';

// import models
import Agent from '../../api/models/Agent';
import User from '../../api/models/User';
import Recommend from '../../api/models/Recommend';
import Goods from '../../api/models/Goods';
import Address from '../../api/models/Address';
import Order from '../../api/models/Order';
import Configs from '../../api/models/Configs';
import Message from '../../api/models/Message';
import UserMessage from '../../api/models/UserMessage';
import Summary from '../../api/models/Summary';
import MSummary from '../../api/models/Msummary';
import YSummary from '../../api/models/Ysummary';
import VCode from '../../api/models/VerificationCode';

describe('initDb', () => {
  mongoose.connection.dropDatabase();
  it('initDb', async () => {
    for (let agent of agentData) {
      const newAgent = new Agent(agent);
      await newAgent.save();
    }
    for (let user of userData) {
      const newUser = new User(user);
      await newUser.save();
    }
    for (let recommend of recommendData) {
      const newRecommend = new Recommend(recommend);
      await newRecommend.save();
    }
    for (let good of goodsData) {
      const newGood = new Goods(good);
      await newGood.save();
    }
    for (let address of addressData) {
      const newAddress = new Address(address);
      await newAddress.save();
    }
    for (let order of orderData) {
      const newOrder = new Order(order);
      await newOrder.save();
    }
    for (let config of ConfigsData) {
      const newConfig = new Configs(config);
      await newConfig.save();
    }
    for (let message of messageData) {
      const newMessage = new Message(message);
      await newMessage.save();
    }
    for (let userMess of userMessData) {
      const newUserMess = new UserMessage(userMess);
      await newUserMess.save();
    }
    for (let summary of summaryData) {
      const newSummary = new Summary(summary);
      await newSummary.save();
    }
    for (let summary of msummaryData) {
      const newSummary = new MSummary(summary);
      await newSummary.save();
    }
    for (let summary of ysummaryData) {
      const newSummary = new YSummary(summary);
      await newSummary.save();
    }
    for (let item of vcodeData) {
      const newData = new VCode(item);
      await newData.save();
    }
  });
  it('Schedule: Summary', async () => {
    // 日度统计
    await daySummary();
    let summNum = await Summary.count({});
    let userNum = await User.count({});
    assert(summNum === userNum * 2);

    // 再生成一次都会跳过
    await daySummary();
    let newSummNum = await Summary.count({});
    assert(summNum === newSummNum);

    // 月度统计
    await monthSummary();
    summNum = await MSummary.count({});
    assert(summNum === userNum * 2);
    // 再生成一次会跳过
    await monthSummary();
    newSummNum = await MSummary.count({});
    assert(summNum === newSummNum);

    // 年度统计
    await yearSummary();
    summNum = await YSummary.count({});
    assert(summNum === userNum * 2);
    // 再生成一次会跳过
    await yearSummary();
    newSummNum = await YSummary.count({});
    assert(summNum === newSummNum);
  });
  it('Schedule: deleteVcode', async () => {
    let bigger = await VCode.count({});
    await deleteVcode();
    let smaller = await VCode.count({});
    assert(bigger > smaller);
  });
});
