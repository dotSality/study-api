import { BaseController } from '../common/base.controller';
import { IControllerRoute } from '../common/route.interface';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { ContainerModule, inject, injectable, interfaces } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserRegisterDTO } from './dto/user.register.dto';
import { UserLoginDTO } from './dto/user.login.dto';
import { IUserService } from './users.service.interface';
import { UserService } from './user.service';
import { ValidateMiddleware } from '../common/validate.middleware';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
	) {
		super(loggerService);
		const routes: IControllerRoute[] = [
			{ path: '/login', function: this.login, method: 'post' },
			{
				path: '/register',
				function: this.register,
				method: 'post',
				middlewares: [
					new ValidateMiddleware(UserRegisterDTO),
					new ValidateMiddleware(UserLoginDTO),
				],
			},
		];
		this.bindRoutes(routes);
	}

	async login(
		req: Request<{}, {}, UserLoginDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const isValid = await this.userService.validateUser(req.body);
		if (isValid) {
			const { email } = req.body;
			const { id, name } = (await this.userRepository.find(email)) as UserModel;
			this.ok(res, { email, id, name });
		} else {
			next(new HTTPError(401, 'Login error', 'login'));
		}
	}

	async register(
		req: Request<{}, {}, UserRegisterDTO>,
		res: Response,
		next: NextFunction,
	): Promise<void> {
		const user = await this.userService.createUser(req.body);
		if (!user) {
			return next(new HTTPError(422, 'This user is already exist.'));
		}
		this.ok(res, { email: user.email, id: user.id });
	}
}

export const usersBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
});
