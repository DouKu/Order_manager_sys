'use strict';
import User from '../models/User';
import Summary from '../models/Summary';

export default async () => {
  try {
    const users = await User.find({});
    for (let user of users) {
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
