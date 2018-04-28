import mongoose from 'mongoose';
// import data
import agentData from '../../script/agentData';
import userData from '../../script/userData';
import recommendData from '../../script/recommendData';
import goodsData from '../../script/goodsData';
import addressData from '../../script/addressData';

// import models
import Agent from '../../api/models/Agent';
import User from '../../api/models/User';
import Recommend from '../../api/models/Recommend';
import Goods from '../../api/models/Goods';
import Address from '../../api/models/Address';

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
  });
});
