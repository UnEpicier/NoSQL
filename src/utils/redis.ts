import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

// -------------------------------------------------- Redis Client -----------------------------------------------------
const client = createClient({
	url: process.env.REDIS_URL || '',
});

client.on('error', (err) => {
	console.error('Redis client error', err);
});

export default client;
