import request from 'supertest';
import { App } from '../src/app';
import { boot } from '../src/main';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('should throw register error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.ru', password: '1' });

		expect(res.status).toBe(422);
	});

	it('should login', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'waeawwr@dwa.kk', password: 'dawdwadad' });

		const user = res.body;

		expect(user.jwt).toBeDefined();
		expect(user.id).toBeDefined();
	});

	it('should fail', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'dawdawwda@dwa.kk', password: 'dawdwadad' });

		expect(res.error).toBeDefined();
	});

	it('should get info', async () => {
		const loginRes = await request(application.app)
			.post('/users/login')
			.send({ email: 'waeawwr@dwa.kk', password: 'dawdwadad' });

		const res = await request(application.app)
			.get('/users/me')
			.set('Authorization', `Bearer ${loginRes.body.jwt}`);

		expect(res.body.userFromDB.email).toBe('waeawwr@dwa.kk');
		expect(res.statusCode).toBe(200);
	});
});

afterAll(() => {
	application.close();
});
