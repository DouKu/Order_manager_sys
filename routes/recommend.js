import { OwnRecommend, findRecommendsByUser } from '../api/controller/recommend';

module.exports = (router, authRouter, commonRouter) => {
  // 查找自己的推荐
  authRouter.get('/recommend', OwnRecommend);
  // 按推荐人id查找推荐
  authRouter.get('/recommend/:userId', findRecommendsByUser);
};
