import { Router } from 'express';
import UsersService from './users.service';
import UsersDto from './dto/users.dto';

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
  }

  async getUsers(req, res, next) {
    try {
      const users = await this.usersService.findUsers();

      res.status(200).json({ users: users.map((user) => new UsersDto(user)) });
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
