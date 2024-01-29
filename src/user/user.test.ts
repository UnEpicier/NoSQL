import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import * as dotenv from 'dotenv';

dotenv.config();

let createdUserId: string;

describe('User Controller Tests', () => {
  describe('I. Create User', () => {
    it('01 POST   - Missing field', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .post('/user')
        .send({
          email: 'test@example.com',
        });

      expect(response.statusCode).toBe(400);
    });

    it('02 POST   - Create User', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .post('/user')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'testpassword',
        });

      createdUserId = response.body.id;

      expect(response.statusCode).toBe(200);
    });
  });
/*
  describe('II. Get All Users', () => {
    it('01 GET    - Include created user', async () => {
      const response = await request(`localhost:${process.env.PORT}`).get('/users');

      const users = response.body;

      expect(users.map((x: any) => x.id)).toContain(createdUserId);
    });
  });

  describe('III. Get User', () => {
    it('01 GET    - Wrong User', async () => {
      const response = await request(`localhost:${process.env.PORT}`).get('/user/12345');

      expect(response.statusCode).toBe(404);
    });

    it('02 GET    - Get User', async () => {
      const response = await request(`localhost:${process.env.PORT}`).get(`/user/${createdUserId}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('IV. Update User', () => {
    it('01 PATCH  - Missing field', async () => {
      const response = await request(`localhost:${process.env.PORT}`).patch(`/user/${createdUserId}`);

      expect(response.statusCode).toBe(400);
    });

    it('02 PATCH  - Update username', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .patch(`/user/${createdUserId}`)
        .send({
          username: 'updatedusername',
        });

      expect(response.body.username).toBe('updatedusername');
    });

    it('03 PATCH  - Update email', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .patch(`/user/${createdUserId}`)
        .send({
          email: 'updated@example.com',
        });

      expect(response.body.email).toBe('updated@example.com');
    });

    it('04 PATCH  - Update password', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .patch(`/user/${createdUserId}`)
        .send({
          password: 'updatedpassword',
        });

      expect(response.body.password).toBe('updatedpassword');
    });

    it('05 PATCH  - Update all', async () => {
      const response = await request(`localhost:${process.env.PORT}`)
        .patch(`/user/${createdUserId}`)
        .send({
          username: 'finalusername',
          email: 'final@example.com',
          password: 'finalpassword',
        });

      expect(response.body).toMatchObject({
        username: 'finalusername',
        email: 'final@example.com',
        password: 'finalpassword',
      });
    });
  });

  describe('V. Get Updated User', () => {
    it('01 GET    - Wrong User', async () => {
      const response = await request(`localhost:${process.env.PORT}`).get('/user/12345');

      expect(response.statusCode).toBe(404);
    });

    it('02 GET    - Get User', async () => {
      const response = await request(`localhost:${process.env.PORT}`).get(`/user/${createdUserId}`);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('VI. Delete User', () => {
    it('01 DEL    - Delete user', async () => {
      const response = await request(`localhost:${process.env.PORT}`).delete(`/user/${createdUserId}`);

      expect(response.statusCode).toBe(200);
    });
  });
  */
});
