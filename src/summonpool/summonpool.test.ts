import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';
import axios from 'axios';
import { Character } from '../types/character';
import { SummonPool } from '../types/summonpool';

dotenv.config();

let characters: Character[] = [];

let summonPool: SummonPool;

describe('0. Create 2 characters', () => {
	it('01 POST   - Create first character', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/character')
			.send({
				sprite: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD',
				hp: 50,
				attack: 100,
				defense: 200,
			});

		characters.push(response.body);

		expect(response.statusCode).toBe(200);
	});

	it('02 POST   - Create second character', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/character')
			.send({
				sprite: 'test.png',
				hp: 200,
				attack: 500,
				defense: 10,
			});

		characters.push(response.body);

		expect(response.statusCode).toBe(200);
	});
});

describe('I. Create summonPool', () => {
	it('01 POST   - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/summonpool')
			.send({
				cost: 10,
			});

		expect(response.statusCode).toBe(400);
	});

	it('01 POST   - Create Summon Pool', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/summonpool')
			.send({
				characters: characters.map((character) => character.id),
				cost: 10,
				duration: 60000,
			});

		summonPool = response.body;

		expect(response.statusCode).toBe(200);
	});
});

describe('II. Get All Summon Pools', () => {
	it('01 GET    - Include created summon pool', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			'/summonpools',
		);

		const summonPools: SummonPool[] = response.body;

		expect(summonPools.map((x) => x.id)).toContain(summonPool.id);
	});
});

describe('III. Update Summon Pool', () => {
	it('01 PATCH  - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`).patch(
			`/summonpool/${summonPool.id}`,
		);

		expect(response.statusCode).toBe(400);
	});

	it('02 PATCH  - Update characters', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/summonpool/${summonPool.id}`)
			.send({
				characters: [characters[0].id],
			});

		expect(response.body.characters.length).toBe(1);
	});

	it('03 PATCH  - Update cost', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/summonpool/${summonPool.id}`)
			.send({
				cost: 100,
			});

		expect(response.body.cost).toBe(100);
	});

	it('04 PATCH  - Update duration', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/summonpool/${summonPool.id}`)
			.send({
				duration: 10000,
			});

		expect(response.body.duration).toBe(10000);
	});

	it('05 PATCH  - Update all', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/summonpool/${summonPool.id}`)
			.send({
				characters: [characters[1].id],
				cost: 1,
				duration: 2,
			});

		expect(response.body).toMatchObject({
			characters: [characters[1]],
			cost: 1,
			duration: 2,
		});
	});
});

describe('IV. Get Updated Summon Pool', () => {
	it('01 GET    - Wrong Summon Pool', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/summonpool/12345`,
		);

		expect(response.statusCode).toBe(404);
	});

	it('02 GET    - Get Summon Pool', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/summonpool/${summonPool.id}`,
		);

		expect(response.statusCode).toBe(200);
	});
});

describe('V. Delete Summon Pool', () => {
	it('01 DEL    - Delete summon pool', async () => {
		const response = await request(`localhost:${process.env.PORT}`).delete(
			`/summonpool/${summonPool.id}`,
		);

		expect(response.statusCode).toBe(200);
	});

	it('02 DEL    - Delete first character', async () => {
		const response = await request(`localhost:${process.env.PORT}`).delete(
			`/character/${characters[0].id}`,
		);

		expect(response.statusCode).toBe(200);
	});

	it('03 DEL    - Delete second character', async () => {
		const response = await request(`localhost:${process.env.PORT}`).delete(
			`/character/${characters[1].id}`,
		);

		expect(response.statusCode).toBe(200);
	});
});
