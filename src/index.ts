import express from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
dotenv.config();

// import example from './example/example.routes';

// ----------------------------------------------------- Server --------------------------------------------------------
const app = express();

app.use(morgan(process.env.NODE_ENV == 'development' ? 'dev' : 'combined'));

// app.use(example);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
