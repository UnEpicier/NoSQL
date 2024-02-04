import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { characters, shopitems, summonpools, users } from './seeder.config.json';
import dotenv from 'dotenv';
dotenv.config();

// ------------------------------------------------------ Utils --------------------------------------------------------
const makeRequest = async (axiosConfig: AxiosRequestConfig<any>) => {
	try {
		const response = await axios(axiosConfig);

		return response.data;
	} catch (e) {
		const error = e as AxiosError;

		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			// console.log("### API response error ###");
			console.error({
				errorSource: 'API response', // this can be replaced each time for giving more infos
				requestUrl: error?.config?.url,
				responseStatus: error.response.status,
				responseData: error.response.data,
			});
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			console.error({
				errorSource: 'API response', // this can be replaced each time for giving more infos
				requestUrl: error?.config?.url,
				responseMessage: error,
			});
		} else {
			// Something happened in setting up the request that triggered an Error
			console.error({
				errorSource: 'API response', // this can be replaced each time for giving more infos
				requestUrl: error?.config?.url,
				responseMessage: error,
			});
		}
	}
};

const getRandomInt = (min: number, max: number) => {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
};
// ---------------------------------------------------------------------------------------------------------------------

const feedTheDB = async () => {
	const baseUrl = `http://localhost:${process.env.PORT}`;
	// ------------------------------------------------------ User ---------------------------------------------------------
	for (let i = 0; i < users.length; i++) {
		const user = users[i];

		await makeRequest({
			baseURL: baseUrl,
			url: '/user',
			method: 'POST',
			data: {
				username: user.username,
				email: user.email,
				password: user.password,
			},
		});
	}

	// ---------------------------------------------------- Character ------------------------------------------------------
	const charactersId: any[] = [];
	for (let i = 0; i < characters.length; i++) {
		const character = characters[i];

		const response = await makeRequest({
			baseURL: baseUrl,
			url: '/character',
			method: 'POST',
			data: {
				attack: character.attack,
				defense: character.defense,
				hp: character.hp,
				sprite: character.sprite,
			},
		});

		charactersId.push(response._id);
	}

	// ---------------------------------------------------- Shop Item ------------------------------------------------------
	for (let i = 0; i < shopitems.length; i++) {
		const shopitem = shopitems[i];
		await makeRequest({
			baseURL: baseUrl,
			url: '/shopitem',
			method: 'POST',
			data: {
				cost: shopitem.cost,
				sprite: shopitem.sprite,
			},
		});
	}

	// --------------------------------------------------- Summon Pool -----------------------------------------------------
	for (let i = 0; i < summonpools.length; i++) {
		const summonpool = summonpools[i];

		const chars: any[] = [];

		for (let j = 0; j < getRandomInt(1, charactersId.length - 1); j++) {
			chars.push(charactersId[getRandomInt(0, charactersId.length - 1)]);
		}

		await makeRequest({
			baseURL: baseUrl,
			url: '/summonpool',
			method: 'POST',
			data: {
				characters: chars,
				cost: summonpool.cost,
				duration: summonpool.duration,
			},
		});
	}
};

feedTheDB();
