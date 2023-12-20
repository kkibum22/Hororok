import UserController from "./users/users.controller";
import FeedControllers from "./feed/feed.controllers";
import AuthControllers from "./auth/auth.controllers";

const Controllers = [UserController, FeedControllers, AuthControllers];

export default Controllers;
