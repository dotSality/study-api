import { IUserService } from './users.service.interface';
import { UserRegisterDTO } from './dto/user.register.dto';
import { UserLoginDTO } from './dto/user.login.dto';
import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UserService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UserRepository) private usersRepository: IUsersRepository,
	) {}

	async createUser({ email, name, password }: UserRegisterDTO): Promise<UserModel | null> {
		const existUser = await this.usersRepository.find(email);
		if (existUser) {
			return null;
		} else {
			const user = new User(email, name);
			const salt = Number(this.configService.get('SALT'));
			await user.setPassword(password, salt);
			return this.usersRepository.create(user);
		}
	}

	async validateUser({ password, email }: UserLoginDTO): Promise<boolean> {
		const existUser = await this.usersRepository.find(email);
		if (existUser) {
			const { email: existEmail, name: existName, password: existPassword } = existUser;
			const user = new User(existEmail, existName, existPassword);
			return user.comparePassword(password);
		} else {
			return false;
		}
	}
}
