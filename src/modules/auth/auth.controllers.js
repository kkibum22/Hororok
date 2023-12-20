import { Router } from 'express';
import AuthService from './auth.service';

class AuthController {
  router;
  path = '/auth'; // path-prefix
  authService;

  constructor() {
    this.router = Router();
    this.authService = new AuthService();
    this.init();
  }

  // route 등록
  init() {
    this.router.post('/login', this.login.bind(this));
    this.router.post('/register', this.register.bind(this));
  }

  async login(req, res, next) {
    try {
      const { name, pw } = req.body;

      const user = await this.authService.login(name, pw);

      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          next(err);
        }
        res.redirect('/');
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req, res, next) {
    try {
      const { pw, name, nickName, birth, gender } = req.body;

      const user = await this.authService.createUser(
        pw,
        name,
        nickName,
        birth,
        gender,
      );

      res.status(200).json({});
    } catch (err) {
      next(err);
    }
  }
}

export default new AuthController();
