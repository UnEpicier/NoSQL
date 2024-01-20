import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';
import { Character } from '../types/character';

dotenv.config();

let item: Character;

describe('I. Get All Characters', () => {
	it('01 GET    - Get 204', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			'/characters',
		);

		const characters: Character[] = response.body;

		expect(response.statusCode).toContain(401);
	});
});
