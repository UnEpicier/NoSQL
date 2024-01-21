import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';
import { Character } from '../types/character';

dotenv.config();

let character: Character;

describe('II. Get All Characters', () => {
	it('01 GET    - Get 204', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			'/characters',
		);

		const characters: Character[] = response.body;

		expect(characters.map((x) => x.id)).toContain(character.id);
	});
});

describe('IV. Get character', () => {
	it('01. GET    - Wrong character', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/character/12345`,
		);

		expect(response.statusCode).toBe(404);
	});

	it('02. GET    - Get character', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/character/${character.id}`,
		);

		expect(response.statusCode).toBe(200);
	});
});
