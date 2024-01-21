import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();

import router from './router/default';

// ----------------------------------------------------- Server --------------------------------------------------------
const app = express();

app.use(morgan(process.env.NODE_ENV == 'development' ? 'dev' : 'combined'));
app.use(router);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
