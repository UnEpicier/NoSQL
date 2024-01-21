import { Character } from './character';

export interface SummonPool {
	id: string;
	characters: Character[];
	cost: number;
	duration: number;
}
