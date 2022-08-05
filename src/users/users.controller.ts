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
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { GuardMiddleware } from '../common/guard.middleware';

@injectable()
export class UserController extends BaseController implements IUserController {
	constructor(
		@inject(TYPES.ILogger) private loggerService: ILogger,
		@inject(TYPES.UserService) private userService: IUserService,
		@inject(TYPES.UserRepository) private userRepository: IUsersRepository,
		@inject(TYPES.ConfigService) private configService: IConfigService,
	) {
		super(loggerService);
		const routes: IControllerRoute[] = [
			{
				path: '/login',
				function: this.login,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserLoginDTO)],
			},
			{
				path: '/register',
				function: this.register,
				method: 'post',
				middlewares: [new ValidateMiddleware(UserRegisterDTO)],
			},
			{
				path: '/me',
				function: this.me,
				method: 'get',
				middlewares: [new GuardMiddleware()],
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
			const { id } = (await this.userRepository.find(email)) as UserModel;
			const secret = this.configService.get('JWT_SECRET');
			const jwt = await this.signJWT(email, secret);
			this.ok(res, { id, jwt });
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

	async me({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		if (user) {
			const userFromDB = await this.userService.getUserInfo(user);
			if (user) this.ok(res, { userFromDB });
			else return next(new HTTPError(401, 'User not found'));
		} else {
			return next(new HTTPError(401, 'User was not provided.'));
		}
	}

	private signJWT(email: string, secret: string): Promise<string> {
		return new Promise<string>((res, rej) => {
			sign(
				{ email, iat: Math.floor(Date.now() / 1000) },
				secret,
				{ algorithm: 'HS256' },
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}

export const usersBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<IUserController>(TYPES.UserController).to(UserController);
	bind<IUserService>(TYPES.UserService).to(UserService);
});
