import { Router } from 'express';
import FeedService from './feed.service';
import { isAuthenticated } from '../../middlewares/isAuthenticated';
import FeedDto from './dto/feed.dto';

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
    this.router.patch('/:feedId', isAuthenticated, this.patchFeed.bind(this));
    this.router.delete('/:feedId', isAuthenticated, this.deleteFeed.bind(this));
    this.router.post(
      '/:feedId/likes',
      isAuthenticated,
      this.likeFeed.bind(this),
    );
    this.router.delete(
      '/:feedId/likes',
      isAuthenticated,
      this.unlikeFeed.bind(this),
    );
  }

  async getFeed(req, res, next) {
    try {
      const { feedid } = req.params;
      const feed = await this.feedService.getFeed(feedid);

      res.status(200).json({ feed: new FeedDto(feed) });
    } catch (err) {
      next(err);
    }
  }

  async getFeeds(req, res, next) {
    try {
      const feeds = await this.feedService.getFeeds();

      res.status(200).json({ feeds: feeds.map((feed) => new FeedDto(feed)) });
    } catch (err) {
      next(err);
    }
  }

  async createFeed(req, res, next) {
    try {
      const { contents } = req.body;
      const user = req.session.user;

      const createFeed = await this.feedService.createFeed(
        contents,
        user.user_id,
      );

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }

  async patchFeed(req, res, next) {
    try {
      const { feedId } = req.params;
      const { contents } = req.body;
      const user = req.session.user;

      const upadtedFeed = await this.feedService.patchFeed(
        feedId,
        contents,
        user.user_id,
      );
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async deleteFeed(req, res, next) {
    try {
      const { feedId } = req.params;
      const user = req.session.user;

      await this.feedService.deleteFeed(feedId, user.user_id);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async likeFeed(req, res, next) {
    try {
      const { feedId } = req.params;
      const user = req.session.user;

      await this.feedService.likeFeed(feedId, user.user_id);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async unlikeFeed(req, res, next) {
    try {
      const { feedId } = req.params;
      const user = req.session.user;

      await this.feedService.unlikeFeed(feedId, user.user_id);
      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new FeedController();
