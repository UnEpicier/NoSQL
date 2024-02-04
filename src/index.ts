import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import redisClient from '@utils/redis';
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json';

dotenv.config();

import shopItem from '@shopitem/shopitem.routes';
import character from '@character/character.routes';
import summonpool from '@summonpool/summonpool.routes';
import user from '@user/user.routes';
import { connectToDB } from '@utils/database';

// ----------------------------------------------------- Server --------------------------------------------------------
const app = express();

app.use(morgan(process.env.NODE_ENV == 'development' ? 'dev' : 'combined'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

app.use(shopItem);
app.use(character);
app.use(summonpool);
app.use(user);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});

const ping = async () => {
	const db = await connectToDB();
	console.log(`MongoDB connection state: ${mongoose.ConnectionStates[mongoose.connection.readyState]}`);
	db.disconnect();

	await redisClient.connect();
	console.log(`Redis connection state: ${(await redisClient.ping()) == 'PONG' ? 'connected' : 'disconnected'}`);
	await redisClient.quit();
};
ping();
