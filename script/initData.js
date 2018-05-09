'use strict';
import '../config/nconf';
import '../config/mongoose';
import mongoose from 'mongoose';
// import data
import agentData from './agentData';
import userData from './userData';
import recommendData from './recommendData';
import goodsData from './goodsData';
import addressData from './addressData';
import ConfigsData from './ConfigsData';
import messageData from './messageData';
import userMessData from './userMessData';
import summaryData from './summaryData';

// import models
import Agent from '../api/models/Agent';
import User from '../api/models/User';
import Recommend from '../api/models/Recommend';
import Goods from '../api/models/Goods';
import Address from '../api/models/Address';
import Configs from '../api/models/Configs';
import Message from '../api/models/Message';
import UserMessage from '../api/models/UserMessage';
import Summary from '../api/models/Summary';

// init mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://172.18.204.180:27017/Order_manager_dev', {
  promiseLibrary: global.Promise
});
mongoose.connection.dropDatabase();
// 初始化代理
async function initDb () {
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
}

initDb()
  .then(() => {
    console.log('init db done!');
    process.exit(0);
  })
  .catch(error => {
    console.log(error);
    process.exit(0);
  });

export {
  initDb
};
