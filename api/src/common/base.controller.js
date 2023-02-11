import { Router } from 'express';

export default class BaseController {
  constructor() {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  send(res, code, message) {
    res.type('application/json');
    return res.status(code).json(message);
  }

  ok(res, message) {
    return this.send(res, 200, message);
  }

  binRoutes(routes) {
    for (const route of routes) {
      console.log(`[${route.method}] ${route.path}`);
      const middleware = route.middlewares;
      const handler = route.func.bind(this);
      const pipeline = middleware ? [...middleware, handler] : handler;
      this.router[route.method](route.path, pipeline);
    }
  }
}
