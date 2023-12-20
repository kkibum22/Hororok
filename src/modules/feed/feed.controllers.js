import { Router } from 'express';
import FeedService from './feed.service';

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
    this.router.get('/', this.getfeed.bind(this));
  }

  async getfeed(req, res, next) {
    try {
      const feed = await this.feedService.findfeed();

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new FeedController();
