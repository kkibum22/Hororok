import { Router } from 'express';
import FeedService from './feed.service';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

class FeedController {
  router;
  path = '/feeds'; // path-prefix
  feedService;

  constructor() {
    this.router = Router();
    this.feedService = new FeedService();
    this.init();
  }

  // route 등록
  init() {
    this.router.post('/', isAuthenticated, this.createFeed.bind(this));
    this.router.get('/', this.getFeeds.bind(this));
    this.router.get('/:feedid', this.getFeed.bind(this));

    // this.router.patch(
    //   '/feeds/{feedId}',
    //   isAuthenticated,
    //   this.createFeed.bind(this),
    // );
    // this.router.delete(
    //   '/feeds/feedId}',
    //   isAuthenticated,
    //   this.createFeed.bind(this),
    // );
  }

  async getFeed(req, res, next) {
    try {
      const { feedid } = req.params;
      const feed = await this.feedService.getFeed(feedid);

      res.status(200).json({ feed });
    } catch (err) {
      next(err);
    }
  }

  async getFeeds(req, res, next) {
    try {
      const feeds = await this.feedService.getFeeds();

      res.status(200).json({ feeds: feeds });
    } catch (err) {
      next(err);
    }
  }

  async createFeed(req, res, next) {
    try {
      const { contents } = req.body;
      const user = req.session.user;

      console.log(user);

      const createFeed = await this.feedService.createFeed(
        contents,
        user.user_id,
      );

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
}



export default new FeedController();
