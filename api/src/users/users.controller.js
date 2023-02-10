import BaseController from '../common/base.controller.js';
import UserService from './users.service.js';

export default class UserConroller extends BaseController {
  constructor() {
    super();
    const routes = [
      {
        path: '/',
        method: 'get',
        func: this.getUsers,
        middlewares: [],
      },
    ];
    this.binRoutes(routes);

    this.usersService = new UserService();
  }

  getUsers = async (req, res) => {
    const users = await this.usersService.getUsers();
    this.ok(res, users);
  };
}
