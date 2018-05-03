import Address from '../models/Address';

// 查看自己的收货地址
const getOwnAddress = async ctx => {
  const result = await Address.find({ userId: ctx.state.userMess.id });
  ctx.body = {
    code: 200,
    data: result
  };
};

// 添加收货地址
const addAddress = async ctx => {
  ctx.verifyParams({
    address: 'string',
    receivePeople: 'string',
    postalCode: 'string',
    receivePhone: 'string'
  });
  const body = ctx.request.body;
  const checkAddress = await Address.findOne({ address: body.address });
  if (checkAddress) {
    ctx.throw(400, '该地址已存在请添加其它地址');
  }
  const newAddress = new Address({
    userId: ctx.state.userMess.id,
    address: body.address,
    receivePeople: body.receivePeople,
    postalCode: body.postalCode,
    receivePhone: body.receivePhone
  });
  await newAddress.save();
  ctx.body = {
    code: 201,
    msg: '成功添加一个新的收货地址！'
  };
};

// 删除收货地址
const deleteAddress = async ctx => {
  const addressId = ctx.params.addressId;
  await Address.deleteOne({ _id: addressId });
  ctx.body = {
    code: 200,
    msg: '成功删除该收货地址'
  };
};

// 更新收货地址
const updateAddress = async ctx => {
  ctx.verifyParams({
    address: { type: 'string', required: false },
    receivePeople: { type: 'string', required: false },
    postalCode: { type: 'string', required: false },
    receivePhone: { type: 'string', required: false }
  });
  const addressId = ctx.params.addressId;
  const body = ctx.request.body;
  body.updateAt = Date.now();
  await Address.updateOne({ _id: addressId }, body);
  ctx.body = {
    code: 200,
    msg: '收货地址信息更新成功！'
  };
};

// 更改默认地址
const changeDefault = async ctx => {
  const addressId = ctx.params.addressId;
  const address = await Address.findById(addressId);
  if (address.userId.toString() !== ctx.state.userMess.id.toString()) {
    ctx.throw(400, '兄弟别瞎搞噢');
  }
  if (address.isDefault) {
    ctx.body = {
      code: 200,
      msg: '默认地址修改成功'
    };
  } else {
    await Address.updateOne(
      {
        userId: ctx.state.userMess.id,
        isDefault: true
      },
      { isDefault: false }
    );
    await Address.findByIdAndUpdate(addressId, { isDefault: true });
    ctx.body = {
      code: 200,
      msg: '默认地址修改成功'
    };
  }
};

export {
  getOwnAddress,
  addAddress,
  deleteAddress,
  updateAddress,
  changeDefault
};
