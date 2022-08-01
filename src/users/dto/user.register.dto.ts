import { IsEmail, IsString } from 'class-validator';

export class UserRegisterDTO {
	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString({ message: 'Password was not provided' })
	password: string;

	@IsString({ message: 'Name was not provided' })
	name: string;
}
