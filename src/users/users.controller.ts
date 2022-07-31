import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { ContainerModule, inject, injectable, interfaces } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
		super(loggerService);
		const routes: IControllerRoute[] = [
			{ path: '/login', function: this.login, method: 'post' },
			{ path: '/register', function: this.register, method: 'post' },
		];
		this.bindRoutes(routes);
	}

	login(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Login error', 'login'));
	}

	register(req: Request, res: Response, next: NextFunction): void {
		next(new HTTPError(401, 'Registration error', 'register'));
	}
}

export const usersBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserController>(TYPES.UserController).to(UserController);
});
