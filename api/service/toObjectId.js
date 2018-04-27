'use strict';
import { Types } from 'mongoose';

// ObjectId转化
const toObjectId = strings => {
  const ObjectId = Types.ObjectId;
  return new ObjectId(strings);
};

export {
  toObjectId
};
