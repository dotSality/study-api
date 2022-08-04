import { IUserService } from './users.service.interface';
import { UserRegisterDTO } from './dto/user.register.dto';
import { UserLoginDTO } from './dto/user.login.dto';
import { inject, injectable } from 'inversify';
import { User } from './user.entity';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UserService implements IUserService {
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {}

	async createUser({ email, name, password }: UserRegisterDTO): Promise<User | null> {
		const user = new User(email, name);
		const salt = Number(this.configService.get('SALT'));
		await user.setPassword(password, salt);
		return user;
	}

	validateUser(user: UserLoginDTO): boolean {
		return false;
	}
}
