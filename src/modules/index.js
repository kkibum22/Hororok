import UserController from './users/users.controller';
import FeedControllers from './feed/feed.controllers';
import AuthControllers from './auth/auth.controllers';
import CommentControllers from './comment/comment.controllers';

const Controllers = [
  UserController,
  FeedControllers,
  AuthControllers,
  CommentControllers,
];

export default Controllers;
