import { Router } from 'express';
import UsersService from './users.service';
import UserDto from './dto/user.dto';

class UserController {
  router;
  path = '/users'; // path-prefix
  usersService;

  constructor() {
    this.router = Router();
    this.usersService = new UsersService();
    this.init();
  }

  // route 등록
  init() {
    this.router.get('/', this.getUsers.bind(this));
    this.router.get('/:userId', this.getUser.bind(this));
    // this.router.patch('/:userId', this.getUsers.bind(this));
    // this.router.delete('/:userId', this.getUsers.bind(this));
    // this.router.get('/:userId/followers', this.getUsers.bind(this));
    // this.router.get('/:userId/follwing', this.getUsers.bind(this));
    // this.router.post(
    //   '/:fromUserId/follows/:toUserId',
    //   this.getUsers.bind(this),
    // );
    // this.router.delete(
    //   '/:fromUserId/follows/:toUserId',
    //   this.getUsers.bind(this),
    // );
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.usersService.findUsers();
      res.status(200).json({ users: users.map((user) => new UserDto(user)) });
    } catch (err) {
      next(err);
    }
  }

  async getUser(req, res, next) {
    try {
      const userId = Number(req.params.userId);
      if (!Number.isInteger(userId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      const user = await this.usersService.findByUserId(userId);
      res.status(200).json({ user: new UserDto(user) });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
