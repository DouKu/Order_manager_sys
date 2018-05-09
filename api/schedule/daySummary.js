'use strict';
import User from '../models/User';
import Summary from '../models/Summary';
import { getdate } from '../service/countDate';

export default async () => {
  try {
    const users = await User.find({});
    const { dayBegin, dayEnd } = getdate();
    for (let user of users) {
      const check = await Summary.findOne({ user: user.id })
        .where('createAt').gte(dayBegin).lte(dayEnd);
      if (check) {
        continue;
      }
      const summary = new Summary({
        user: user.id,
        goods: [],
        createAt: Date.now()
      });
      await summary.save();
    }
  } catch (error) {
    console.log(error.message);
  }
};
