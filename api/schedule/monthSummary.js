'use strict';
import User from '../models/User';
import MSummary from '../models/Msummary';
import { getMonth } from '../service/countDate';

export default async () => {
  try {
    const users = await User.find({});
    const { monthBegin, monthEnd } = getMonth();
    for (let user of users) {
      const check = await MSummary.findOne({ user: user.id })
        .where('createAt').gte(monthBegin).lte(monthEnd);
      if (check) {
        continue;
      }
      const summary = new MSummary({
        user: user.id,
        goods: [],
        createAt: Date.now()
      });
      await summary.save();
    }
    console.log('monthly summary add at', new Date());
  } catch (error) {
    console.log(error.message);
  }
};
