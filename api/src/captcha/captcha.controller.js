import BaseController from '../common/base.controller.js';
import CaptchaService from './captcha.service.js';

export default class CaptchaController extends BaseController {
  constructor() {
    super();
    const routes = [
      {
        path: '/',
        method: 'get',
        func: this.getCaptcha,
        middlewares: [],
      },
      {
        path: '/verify',
        method: 'get',
        func: this.verifyCaptcha,
        middlewares: [],
      },
    ];
    this.binRoutes(routes);

    this.captchaService = new CaptchaService();
  }

  getCaptcha = async (req, res, next) => {
    try {
      const captcha = await this.captchaService.getCaptcha();
      this.ok(res, captcha);
    } catch (e) {
      next(e);
    }
  };

  verifyCaptcha = async (req, res, next) => {
    try {
      const { id, text } = req.query;
      const result = await this.captchaService.verifyCaptcha(id, text);
      this.ok(res, result);
    } catch (e) {
      next(e);
    }
  };
}
