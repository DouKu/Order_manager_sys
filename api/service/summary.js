'use strict';
import _ from 'lodash';
import Summary from '../models/Summary';
import MSummary from '../models/Msummary';
import YSummary from '../models/Ysummary';
import { getdate, getMonth, getYear } from './countDate';

/**
 * 商品归类与数量统计
 * @param {Array} goods // 订单商品
 * @param {Object} summary // 统计表对象
 */
function countGoods (goods, summary) {
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

  return {
    upGoods,
    goodsNum
  };
}

// 添加到日统计表
const addSummary = async (order) => {
  // 商品
  const goods = order.goods;
  let date = getdate();
  const dsummary = await Summary.findOne({ user: order.toUser })
    .where('createAt').gte(date.dayBegin).lte(date.dayEnd);

  date = getMonth();
  const msummary = await MSummary.findOne({ user: order.toUser })
    .where('createAt').gte(date.monthBegin).lte(date.monthEnd);

  date = getYear();
  const ysummary = await YSummary.findOne({ user: order.toUser })
    .where('createAt').gte(date.yearBegin).lte(date.yearEnd);

  let goodDeel = countGoods(goods, dsummary);
  await Summary.findByIdAndUpdate(dsummary.id, {
    goods: goodDeel.upGoods,
    goodsNum: goodDeel.goodsNum,
    sumPrice: dsummary.sumPrice + order.sumPrice
  });

  goodDeel = countGoods(goods, msummary);
  await MSummary.findByIdAndUpdate(msummary.id, {
    goods: goodDeel.upGoods,
    goodsNum: goodDeel.goodsNum,
    sumPrice: msummary.sumPrice + order.sumPrice
  });

  goodDeel = countGoods(goods, ysummary);
  await YSummary.findByIdAndUpdate(ysummary.id, {
    goods: goodDeel.upGoods,
    goodsNum: goodDeel.goodsNum,
    sumPrice: ysummary.sumPrice + order.sumPrice
  });
};

export {
  addSummary
};
