import axios, { AxiosError, AxiosRequestConfig } from 'axios';
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
			return {
				error: {
					errorSource: 'API response', // this can be replaced each time for giving more infos
					requestUrl: error?.config?.url,
					responseStatus: error.response.status,
					responseData: error.response.data,
				},
			};
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			return {
				error: {
					errorSource: 'API response', // this can be replaced each time for giving more infos
					requestUrl: error?.config?.url,
					responseMessage: error,
				},
			};
		} else {
			// Something happened in setting up the request that triggered an Error
			return {
				error: {
					errorSource: 'API response', // this can be replaced each time for giving more infos
					requestUrl: error?.config?.url,
					responseMessage: error,
				},
			};
		}
	}
};
// ---------------------------------------------------------------------------------------------------------------------

const feedTheDB = async () => {
	const baseUrl = `http://localhost:${process.env.PORT}`;
	// ------------------------------------------------------ User ---------------------------------------------------------
	await makeRequest({
		baseURL: baseUrl,
		url: '/user',
		method: 'POST',
		data: {
			username: 'Alexis',
			email: 'alexis.vasseur@ynov.com',
			password: '1234',
		},
	});
	await makeRequest({
		baseURL: baseUrl,
		url: '/user',
		method: 'POST',
		data: {
			username: 'Charles',
			email: 'charles.brun@ynov.com',
			password: '12345',
		},
	});
	await makeRequest({
		baseURL: baseUrl,
		url: '/user',
		method: 'POST',
		data: {
			username: 'Matthias',
			email: 'matthias.batguzere@ynov.com',
			password: '123456',
		},
	});
	await makeRequest({
		baseURL: baseUrl,
		url: '/user',
		method: 'POST',
		data: {
			username: 'Mehdi',
			email: 'mehdi.senhaj@ynov.com',
			password: '1234567',
		},
	});
	// ---------------------------------------------------- Character ------------------------------------------------------
	// ---------------------------------------------------- Shop Item ------------------------------------------------------
	// --------------------------------------------------- Summon Pool -----------------------------------------------------
};

feedTheDB();
