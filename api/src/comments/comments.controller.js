import BaseController from '../common/base.controller.js';
import CommentService from './comments.service.js';
import CaptchaService from '../captcha/captcha.service.js';
import ApiExeption from '../exeptions/api.exeption.js';
import { body, validationResult, check } from 'express-validator';
import FileService from '../services/file.service.js';

export default class CommentConroller extends BaseController {
  constructor(io, cache, eventEmitter, fileQueue) {
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
          body('parentId')
            .optional()
            .isInt()
            .withMessage('Parent Id is invalid'),
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
        middlewares: [check('parentId').isInt()],
      },
    ];
    this.io = io;
    this.cache = cache;
    this.eventEmitter = eventEmitter;
    this.fileQueue = fileQueue;
    this.binRoutes(routes);
    this.commentsService = new CommentService(
      this.cache,
      this.eventEmitter,
      this.fileQueue,
    );
    this.captchaService = new CaptchaService();
  }

  fileService = new FileService();

  create = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(ApiExeption.BadRequest('Validation Error', errors.array()));
    } else {
      try {
        const { file, captcha } = req.body;
        const checkCaptcha = await this.captchaService.verifyCaptcha(
          captcha.id,
          captcha.text,
        );

        if (!checkCaptcha.success) {
          next(
            ApiExeption.BadRequest('Captcha is invalid', {
              message: 'Captcha is invalid',
            }),
          );
        }
        if (file) {
          const validationResult = await this.fileService.validateFile(file);
          if (!validationResult.success) {
            next(
              ApiExeption.BadRequest('Validation Error', {
                message: validationResult.message,
              }),
            );
          }
          if(validationResult.success) {
            req.body.file = validationResult;
            const result = await this.commentsService.create(req.body);
            if (result) {
              this.io.emit('update', 'update');
            }
            this.ok(res, result);
          }
        } else {
          const result = await this.commentsService.create(req.body);
          if (result) {
            this.io.emit('update', 'update');
          }
          this.ok(res, result);
        }
      } catch (e) {
        next(e);
      }
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
  };
}
