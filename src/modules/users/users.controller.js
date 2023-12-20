import { Router } from 'express';
import UsersService from './users.service';
import UserDto from './dto/user.dto';
import EditUserDTO from './dto/edit-user.dto';
import { isAuthenticated } from '../../middlewares/isAuthenticated';

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
    this.router.patch('/:userId', isAuthenticated, this.editUser.bind(this));
    this.router.delete('/:userId', isAuthenticated, this.deleteUser.bind(this));
    this.router.get('/:userId/followers', this.getFollowers.bind(this));
    this.router.get('/:userId/following', this.getFollowing.bind(this));
    this.router.post(
      '/:fromUserId/follows/:toUserId',
      isAuthenticated,
      this.follow.bind(this),
    );
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

  async editUser(req, res, next) {
    try {
      const sessionUser = req.session.user;
      const userId = Number(req.params.userId);
      if (!Number.isInteger(userId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      if (sessionUser.user_id !== userId) {
        throw { status: 401, message: '권한이 없습니다.' };
      }
      const editUserDto = new EditUserDTO(req.body);

      await this.usersService.editUser(userId, editUserDto);
      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const sessionUser = req.session.user;
      const userId = Number(req.params.userId);
      if (!Number.isInteger(userId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      if (sessionUser.user_id !== userId) {
        throw { status: 401, message: '권한이 없습니다.' };
      }

      await this.usersService.deleteUser(userId);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }

  async getFollowers(req, res, next) {
    try {
      const userId = Number(req.params.userId);
      if (!Number.isInteger(userId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      const follwers = await this.usersService.findFollowersById(userId);
      res
        .status(200)
        .json({ follwers: follwers.map((user) => new UserDto(user)) });
    } catch (err) {
      next(err);
    }
  }

  async getFollowing(req, res, next) {
    try {
      const userId = Number(req.params.userId);
      if (!Number.isInteger(userId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      const follwing = await this.usersService.findFollowingById(userId);
      res
        .status(200)
        .json({ follwing: follwing.map((user) => new UserDto(user)) });
    } catch (err) {
      next(err);
    }
  }

  async follow(req, res, next) {
    try {
      const sessionUser = req.session.user;
      const fromUserId = Number(req.params.fromUserId);
      const toUserId = Number(req.params.toUserId);

      if (!Number.isInteger(fromUserId) || !Number.isInteger(toUserId)) {
        throw {
          status: 400,
          message: '잘못된 요청입니다. userId는 숫자 형식이여야 합니다.',
        };
      }
      if (sessionUser.user_id !== fromUserId) {
        throw { status: 401, message: '권한이 없습니다.' };
      }
      this.usersService.createFollows(fromUserId, toUserId);

      res.status(204).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController();
