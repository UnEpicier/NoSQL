import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';
import { Character } from '../types/character';

dotenv.config();

let character: Character;

describe('I. Create character', () => {
	it('01 POST   - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/character')
			.send({
				sprite: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD',
			});

		expect(response.statusCode).toBe(400);
	});

	it('01 POST   - Create character', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/character')
			.send({
				sprite: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD',
				hp: 50,
				attack: 100,
				defense: 200,
			});

		character = response.body;

		expect(response.statusCode).toBe(200);
	});
});

describe('II. Get All Characters', () => {
	it('01 GET    - Include created item', async () => {
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
