import BaseController from '../common/base.controller.js';
import CommentService from './comments.service.js';
import { body, validationResult } from 'express-validator';
import ApiExeption from '../exeptions/api.exeption.js';

export default class CommentConroller extends BaseController {
  constructor(io) {
    super();
    const routes = [
      {
        path: '/',
        method: 'post',
        func: this.create,
        middlewares: [body('username').isLength({ min: 3, max: 16 })],
      },
    ];
    this.io = io;
    this.binRoutes(routes);

    this.commentsService = new CommentService();
  }

  create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(ApiExeption.BadRequest('Ошибка валидации', errors.array()));
    } else {
      const result = await this.commentsService.create(req.body);
      // если коммент создался то делаем емит на апдейт.
      this.ok(res, result);
    }
  };
}
