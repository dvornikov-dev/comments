import BaseController from '../common/base.controller.js';
import UserService from './users.service.js';

export default class UserConroller extends BaseController {
  constructor() {
    super();
    const routes = [
      {
        path: '/',
        method: 'get',
        func: this.getUser,
        middlewares: [],
      },
    ];
    this.binRoutes(routes);

    this.usersService = new UserService();
  }

  getUser = async (req, res, next) => {
    try {
      const headerAuthorization = req.headers.authorization;
      if (!headerAuthorization) {
        throw Error('Invalid authorization header');
      }
      const accessToken = headerAuthorization.split(' ')[1];

      const users = await this.usersService.getUser({ token: accessToken });
      this.ok(res, users);
    } catch (e) {
      next(e);
    }
  };
}
