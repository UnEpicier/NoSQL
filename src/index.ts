import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
dotenv.config();

// import example from './example/example.routes';
import shopItem from '@shopitem/shopitem.routes';

// ----------------------------------------------------- Server --------------------------------------------------------
const app = express();

app.use(morgan(process.env.NODE_ENV == 'development' ? 'dev' : 'combined'));
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

// app.use(example);
app.use(shopItem);

app.listen(process.env.PORT, () => {
	console.log(`Server is running on port ${process.env.PORT}`);
});
