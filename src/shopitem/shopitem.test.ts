import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';
import { ShopItem } from '../types/shopItem';

dotenv.config();

let item: ShopItem;

describe('I. Create item', () => {
	it('01 POST   - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/shopitem')
			.send({
				sprite: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD',
			});

		expect(response.statusCode).toBe(400);
	});

	it('02 POST   - Created item', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.post('/shopitem')
			.send({
				cost: 50,
				sprite: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAZABkAAD',
			});

		item = response.body;

		expect(response.statusCode).toBe(200);
	});
});

describe('II. Get All Items', () => {
	it('01 GET    - Include created item', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			'/shopitems',
		);

		const shopItems: ShopItem[] = response.body;

		expect(shopItems.map((x) => x.id)).toContain(item.id);
	});
});

describe('III. Update Item', () => {
	it('01 PATCH  - Missing field', async () => {
		const response = await request(`localhost:${process.env.PORT}`).patch(
			`/shopitem/${item.id}`,
		);

		expect(response.statusCode).toBe(400);
	});

	it('02 PATCH  - Update cost', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/shopitem/${item.id}`)
			.send({
				cost: 100,
			});

		expect(response.body.cost).toBe(100);
	});

	it('03 PATCH  - Update sprite', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/shopitem/${item.id}`)
			.send({
				sprite: 'testimage.png',
			});

		expect(response.body.sprite).toBe('testimage.png');
	});

	it('04 PATCH  - Update all', async () => {
		const response = await request(`localhost:${process.env.PORT}`)
			.patch(`/shopitem/${item.id}`)
			.send({
				cost: 200,
				sprite: 'sprite.png',
			});

		expect(response.body).toMatchObject({
			id: item.id,
			cost: 200,
			sprite: 'sprite.png',
		});
	});
});

describe('IV. Get Updated Item', () => {
	it('01 GET    - Wrong Item', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/shopitem/12345`,
		);

		expect(response.statusCode).toBe(404);
	});

	it('02 GET    - Get Item', async () => {
		const response = await request(`localhost:${process.env.PORT}`).get(
			`/shopitem/${item.id}`,
		);

		expect(response.statusCode).toBe(200);
	});
});

describe('V. Delete Item', () => {
	it('01 DEL    - Delete item', async () => {
		const response = await request(`localhost:${process.env.PORT}`).delete(
			`/shopitem/${item.id}`,
		);

		expect(response.statusCode).toBe(200);
	});
});
