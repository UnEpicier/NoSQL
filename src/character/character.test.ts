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

describe('III. Update Character', () => {
	it('01 PATCH  - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`).patch(
			`/character/${character.id}`,
		);

		expect(response.statusCode).toBe(400);
	});

	it('02 PATCH  - Update sprite', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/character/${character.id}`)
			.send({
				sprite: 'testimage.png',
			});

		expect(response.body.sprite).toBe('testimage.png');
	});

	it('03 PATCH  - Update hp', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/character/${character.id}`)
			.send({
				hp: 200,
			});

		expect(response.body.hp).toBe(200);
	});

	it('04 PATCH  - Update attack', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/character/${character.id}`)
			.send({
				attack: 200,
			});

		expect(response.body.attack).toBe(200);
	});

	it('05 PATCH  - Update defense', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/character/${character.id}`)
			.send({
				defense: 50,
			});

		expect(response.body.defense).toBe(50);
	});

	it('06 PATCH  - Update all', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/character/${character.id}`)
			.send({
				sprite: 'all.png',
				hp: 2000,
				attack: 2000,
				defense: 2000,
			});

		expect(response.body).toMatchObject({
			sprite: 'all.png',
			hp: 2000,
			attack: 2000,
			defense: 2000,
		});
	});
});

describe('IV. Get updated character', () => {
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
