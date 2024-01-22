import { Character } from './character';

export interface User {
	id: string;
	username: string;
	email: string;
	password: string;
  currency: number;
	rank: number;
	roster: Character[];
}
