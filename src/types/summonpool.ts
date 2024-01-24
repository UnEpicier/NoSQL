import { Character } from './character';

export interface SummonPool {
	_id: string;
	characters: Character[] | string[];
	cost: number;
	duration: number;
}
