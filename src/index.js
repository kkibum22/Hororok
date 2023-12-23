import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import prisma from './db';
import Controllers from './modules';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { isAuthenticated } from './middlewares/isAuthenticated';
const MemoryStore = require('memorystore')(session);

(async () => {
  const app = express();
  // db connection
  await prisma.$connect();

  // middleware
  app.use(
    cors({
      origin: 'http://localhost:5173', // Vue 앱의 URL로 변경
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      unset: 'destroy',
      store: new MemoryStore({
        checkPeriod: 86400000,
      }),
      cookie: {
        maxAge: 86400000,
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      },
    }),
  );

  //코멘트 생성
  app.post(
    '/feeds/:feedId/comments',
    isAuthenticated,
    async (req, res, next) => {
      const { feedId } = req.params;
      const { contents } = req.body;
      const user = req.session.user;

      console.log(user);
      try {
        const newComment = await prisma.comment.create({
          data: {
            contents,
            feed: { connect: { feed_id: parseInt(feedId) } },
            user: { connect: { user_id: parseInt(user.user_id) } },
          },
        });
        res.status(201).json();
      } catch (err) {
        next(err);
      }
    },
  );

  //코멘트 조회
  app.get('/feeds/:feedId/comments', async (req, res, next) => {
    const { feedId } = req.params;
    try {
      const comments = await prisma.comment.findMany({
        where: {
          feed_id: parseInt(feedId),
        },
      });
      res.status(200).json({ comments: comments });
    } catch (err) {
      console.log(err);
      next(err);
    }
  });

  //코멘트 수정
  app.patch(
    '/feeds/comments/:commentId',
    isAuthenticated,
    async (req, res, next) => {
      const { commentId } = req.params;
      const { contents } = req.body;
      const user = req.session.user;
      try {
        const upadtedComment = await prisma.comment.update({
          where: {
            comment_id: parseInt(commentId),
          },
          data: {
            contents,
            user: { connect: { user_id: parseInt(user.user_id) } },
          },
        });
        res.status(204).json();
      } catch (err) {
        next(err);
      }
    },
  );

  //코멘트 삭제
  app.delete(
    '/feeds/comments/:commentId',
    isAuthenticated,
    async (req, res, next) => {
      const { commentId } = req.params;
      const user = req.session.user;

      try {
        const deletedComment = await prisma.comment.delete({
          where: {
            comment_id: parseInt(commentId),
            user_id: parseInt(user.user_id),
          },
        });
        res.status(204).json();
      } catch (err) {
        next(err);
      }
    },
  );

  // route
  Controllers.forEach((controller) => {
    app.use(controller.path, controller.router);
  });

  //피드 수정
  app.patch('/feeds/:feedId', isAuthenticated, async (req, res, next) => {
    const { feedId } = req.params;
    const { contents } = req.body;
    const user = req.session.user;
    try {
      const upadtedFeed = await prisma.feed.update({
        where: {
          feed_id: parseInt(feedId),
        },
        data: {
          contents,
          user: { connect: { user_id: parseInt(user.user_id) } },
        },
      });
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  });

  //피드 삭제
  app.delete('/feeds/:feedId', isAuthenticated, async (req, res, next) => {
    const { feedId } = req.params;
    const user = req.session.user;

    try {
      const deletedFeed = await prisma.feed.delete({
        where: {
          feed_id: parseInt(feedId),
          user_id: parseInt(user.user_id),
        },
      });
      res.status(204).json();
    } catch (err) {
      next(err);
    }
  });

  // route
  Controllers.forEach((controller) => {
    app.use(controller.path, controller.router);
  });

  // error handling
  app.use((err, req, res, next) => {
    res
      .status(err.status || 500)
      .json({ message: err.message || '서버에서 에러가 발생하였습니다.' });
  });

  app.listen(8000, () => {
    console.log('서버가 시작되었습니다.');
  });
})();
