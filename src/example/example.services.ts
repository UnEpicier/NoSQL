const getHelloWorldInDB = async () => {
	/*
    C'est ici que tu dois communiquer avec la base de donnée
    */
	try {
		return 'Hello World';
	} catch (error) {
		throw Error('Impossible de se connecter à la base de donnée.');
	}
};

export { getHelloWorldInDB };
