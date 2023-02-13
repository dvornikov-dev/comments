import BaseController from '../common/base.controller.js';
import CommentService from './comments.service.js';
import ApiExeption from '../exeptions/api.exeption.js';
import { body, validationResult, check } from 'express-validator';

export default class CommentConroller extends BaseController {
  constructor(io) {
    super();
    const routes = [
      {
        path: '/',
        method: 'post',
        func: this.create,
        middlewares: [
          body('username')
            .isLength({ min: 4, max: 16 })
            .withMessage('Username must be 4-16 characters long')
            .matches(/^[a-zA-Z0-9]+$/, 'i')
            .withMessage('Username can only contain letters and numbers'),
          body('email').isEmail().withMessage('Email is invalid'),
          body('homeUrl').optional().isURL().withMessage('Url is invalid'),
          body('message').not().isEmpty().withMessage('Message is required'),
          body('parentId').optional().isInt().withMessage('Parent Id is invalid'),
        ],
      },
      {
        path: '/',
        method: 'get',
        func: this.getRootComments,
        middlewares: [
          check('limit').optional().isInt(),
          check('offset').optional().isInt(),
          check('sortField')
            .optional()
            .matches(/^[a-zA-Z]+$/, 'i'),
          check('sortType')
            .optional()
            .matches(/^[a-zA-Z]+$/, 'i'),
        ],
      },
      {
        path: '/childs',
        method: 'get',
        func: this.getChildsComments,
        middlewares: [
          check('parentId').isInt(),
        ],
      },
    ];
    this.io = io;
    this.binRoutes(routes);

    this.commentsService = new CommentService();
  }

  create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(ApiExeption.BadRequest('Validation Error', errors.array()));
    } else {
      const result = await this.commentsService.create(req.body); //TODO: try catch
      console.log(result);
      // если коммент создался то делаем емит на апдейт.
      this.ok(res, { success: true });
    }
  };

  getRootComments = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(ApiExeption.BadRequest('Validation Error', errors.array()));
    } else {
      const { limit, offset, sortField, sortType } = req.query;
      try {
        const result = await this.commentsService.getRootComments(
          limit,
          offset,
          sortField,
          sortType,
        );
        this.ok(res, result);
      } catch (e) {
        next(e);
      }
    }
  };

  getChildsComments = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(ApiExeption.BadRequest('Validation Error', errors.array()));
    } else {
      const { parentId } = req.query;
      try {
        const result = await this.commentsService.getChildsComments(parentId);
        this.ok(res, result);
      } catch (e) {
        next(e);
      }
    }
  }
}
