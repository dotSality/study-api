import { IUserService } from './users.service.interface';
import { UserRegisterDTO } from './dto/user.register.dto';
import { UserLoginDTO } from './dto/user.login.dto';
import { injectable } from 'inversify';
import { User } from './user.entity';

@injectable()
export class UserService implements IUserService {
	async createUser({ email, name, password }: UserRegisterDTO): Promise<User | null> {
		const user = new User(email, name);
		await user.setPassword(password);
		return user;
	}

	validateUser(user: UserLoginDTO): boolean {
		return false;
	}
}
