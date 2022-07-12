import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { IControllerRoute } from '../common/route.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    const routes: IControllerRoute[] = [
      { path: '/login', function: this.login, method: 'post' },
      { path: '/register', function: this.register, method: 'post' },
    ];
    this.bindRoutes(routes);
  }

  login(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'Login error', 'login'));
  }

  register(req: Request, res: Response, next: NextFunction) {
    next(new HTTPError(401, 'Registration error', 'register'));
  }
}