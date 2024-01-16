export default {
	clearMocks: true,
	coverageProvider: 'v8',
	moduleFileExtensions: ['js', 'ts', 'json', 'node'],
	roots: ['<rootDir>/src'],
	testMatch: ['**/__tests__/**/*.[jt]s', '**/?(*.)+(spec|test).[jt]s'],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
};
