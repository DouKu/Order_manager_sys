'use strict';
import _ from 'lodash';
import Summary from '../models/Summary';
import { getdate } from './countDate';

// 添加到日统计表
const addSummary = async (order) => {
  // 商品
  const goods = order.goods;
  const date = getdate();
  const summary = await Summary.findOne({ user: order.toUser })
    .where('createAt').gte(date.dayBegin).lte(date.dayEnd);

  // 添加商品名到集合
  const goodSet = new Set();
  for (let good of goods) {
    goodSet.add(good.name);
  }
  for (let sgood of summary.goods) {
    goodSet.add(sgood.name);
  }
  const upGoods = [];
  // 商品总购买量
  let goodsNum = 0;
  // 遍历集合组织商品参数
  for (let item of goodSet.keys()) {
    const data = {};
    const orderGoods = _.filter(goods, { name: item });
    const summaryGoods = _.filter(summary.goods, { name: item });
    // 初始化商品名
    data.name = item;
    // 计算添加商品数量
    data.num = 0;
    for (let orderGoodsNum of orderGoods) {
      data.num += orderGoodsNum.num;
    }
    for (let sumGoodsNum of summaryGoods) {
      data.num += sumGoodsNum.num;
    }
    upGoods.push(data);
    goodsNum += data.num;
  }

  await Summary.findByIdAndUpdate(summary.id,
    { goods: upGoods, goodsNum, sumPrice: summary.sumPrice + order.sumPrice }
  );
};

export {
  addSummary
};
