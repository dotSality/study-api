import { IsEmail, IsString } from 'class-validator';

export class UserLoginDTO {
	@IsEmail({}, { message: 'Email was not provided' })
	email: string;

	@IsString({ message: 'Password was not provided' })
	password: string;
}
