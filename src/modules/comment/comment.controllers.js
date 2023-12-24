import { Router } from 'express';
import CommentService from './comment.service';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

class CommentController {
  router;
  path = '/feeds';
  commentService;

  constructor() {
    this.router = Router();
    this.commentService = new CommentService();
    this.init();
  }

  init() {
    this.router.post(
      '/:feedId/comments',
      isAuthenticated,
      this.createComment.bind(this),
    );
    this.router.get('/:feedId/comments', this.getComment.bind(this));
    this.router.patch(
      '/comments/:commentId',
      isAuthenticated,
      this.patchComment.bind(this),
    );
    this.router.delete(
      '/comments/:commentId',
      isAuthenticated,
      this.deleteComment.bind(this),
    );
  }

  async createComment(req, res, next) {
    try {
      const { feedId } = req.params;
      const { contents } = req.body;
      const user = req.session.user;

      const createComment = await this.commentService.createComment(
        feedId,
        contents,
        user.user_id,
      );
      res.status(201).json();
    } catch (err) {
      next(err);
    }
  }

  async getComment(req, res, next) {
    try {
      const { feedId } = req.params;

      const comments = await this.commentService.getComment(feedId);
      res.status(200).json({ comments });
    } catch (err) {
      next(err);
    }
  }

  async patchComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const { contents } = req.body;
      const user = req.session.user;
      const upadtedComment = await this.commentService.patchComment(
        commentId,
        contents,
        user,
      );
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const { commentId } = req.params;
      const user = req.session.user;

      const deletedComment = await this.commentService.deleteComment(
        commentId,
        user,
      );
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  }
}

export default new CommentController();
