'use strict';
import User from '../models/User';
import YSummary from '../models/Ysummary';
import { getYear } from '../service/countDate';

export default async () => {
  try {
    const users = await User.find({});
    const { yearBegin, yearEnd } = getYear();
    for (let user of users) {
      const check = await YSummary.findOne({ user: user.id })
        .where('createAt').gte(yearBegin).lte(yearEnd);
      if (check) {
        continue;
      }
      const summary = new YSummary({
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
