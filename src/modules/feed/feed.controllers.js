import { Router } from 'express';
import FeedService from './feed.service';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

class FeedController {
  router;
  path = '/feed'; // path-prefix
  feedService;

  constructor() {
    this.router = Router();
    this.feedService = new FeedService();
    this.init();
  }

  // route 등록
  init() {
    this.router.get('/', this.getFeed.bind(this));
    this.router.post('/', isAuthenticated, this.createFeed.bind(this));
  }

  async getFeed(req, res, next) {
    try {
      const feed = await this.feedService.findFeed();
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }

  async createFeed(req, res, next) {
    try {
      console.log(req.session.user); // 로그인 유저 데이터

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new FeedController();
