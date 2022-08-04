import { IUsersRepository } from './users.repository.interface';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';
import { IPrismaService } from '../database/prisma.service.interface';
import { TYPES } from '../types';

@injectable()
export class UsersRepository implements IUsersRepository {
	constructor(@inject(TYPES.PrismaService) private prismaService: IPrismaService) {}

	async create({ email, name, password }: User): Promise<UserModel> {
		return this.prismaService.client.userModel.create({
			data: {
				email,
				password,
				name,
			},
		});
	}

	async find(email: string): Promise<UserModel | null> {
		return this.prismaService.client.userModel.findFirst({
			where: {
				email,
			},
		});
	}
}
