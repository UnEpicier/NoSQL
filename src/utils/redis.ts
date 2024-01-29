import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

// -------------------------------------------------- Redis Client -----------------------------------------------------
const client = createClient({
	url: process.env.REDIS_URI || '',
});

client.on('error', (err) => {
	console.error('Redis client error', err);
});

export default client;
