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

// import models
import Agent from '../api/models/Agent';
import User from '../api/models/User';
import Recommend from '../api/models/Recommend';
import Goods from '../api/models/Goods';
import Address from '../api/models/Address';
import Configs from '../api/models/Configs';

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
