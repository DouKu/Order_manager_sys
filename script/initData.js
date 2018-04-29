'use strict';

import mongoose from 'mongoose';
// import data
import agentData from './agentData';

// import models
import Agent from '../api/models/Agent';

// init mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/Order_manager_test', {
  promiseLibrary: global.Promise
});

// 初始化代理
async function init () {
  try {
    for (let agent of agentData) {
      const newAgent = new Agent(agent);
      await newAgent.save();
    }
    return;
  } catch (error) {
    console.log(error.message);
  }
}

init();
