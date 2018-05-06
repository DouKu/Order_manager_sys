'use strict';
import Public from '../models/Public';

const getPublics = async ctx => {
  const data = await Public.find({});
  ctx.body = {
    code: 200,
    data
  };
};

// 添加共有素材地址
const addPublic = async ctx => {
  ctx.verifyParams({
    des: 'string',
    Link: 'string',
    pass: 'string'
  });
  const body = ctx.request.body;
  const newPublic = new Public(body);
  await newPublic.save();
  ctx.body = {
    code: 200,
    msg: '成功添加一条公有素材信息！'
  };
};

// 删除收货地址
const deletePublic = async ctx => {
  const publicId = ctx.params.publicId;
  await Public.findByIdAndRemove(publicId);
  ctx.body = {
    code: 200,
    msg: '删除成功！'
  };
};

// 更新收货地址
const updatePublic = async ctx => {
  ctx.verifyParams({
    des: { type: 'string', required: false },
    Link: { type: 'string', required: false },
    pass: { type: 'string', required: false }
  });
  const publicId = ctx.params.publicId;
  const body = ctx.request.body;
  await Public.updateOne({ _id: publicId }, body);
  ctx.body = {
    code: 200,
    msg: '更改成功！'
  };
};

export {
  getPublics,
  addPublic,
  deletePublic,
  updatePublic
};
