import { Request, Response } from 'express';
import { getHelloWorldInDB } from './example.services';

const getHelloWorld = async (req: Request, res: Response) => {
	if (req.errored) {
		console.error('Error on getHelloWorld');
		res.status(500).send('Error');

		return;
	}

	try {
		const response = await getHelloWorldInDB();
		res.status(200).send(response);
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export { getHelloWorld };
