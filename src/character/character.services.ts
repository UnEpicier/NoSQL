// ----------------------------------------------------- Models --------------------------------------------------------
import CharacterModel from '@models/Character';
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------ Utils --------------------------------------------------------
import redisClient from '@utils/redis';
import { connectToDB } from '@utils/database';
// ---------------------------------------------------------------------------------------------------------------------

// ------------------------------------------------------ Types --------------------------------------------------------
import { Character } from '../types/character';
// ---------------------------------------------------------------------------------------------------------------------

const getAllCharactersInDB = async (): Promise<Character[]> => {
    try {
        await redisClient.connect();

        const cacheKeys = await redisClient.KEYS('character:*');

        const cacheCharacters: Character[] = [];

        for (const key of cacheKeys) {
            const character = await redisClient.HGETALL(key);

            cacheCharacters.push({
                id: key,
                sprite: character.sprite,
                hp: parseInt(character.hp),
                attack: parseFloat(character.attack),
                defense: parseFloat(character.defense),
            });
        }

        const db = await connectToDB();
        const dbCharacters: Character[] = await CharacterModel.find({});

        const toDeleteFromCache = cacheCharacters.filter((x) => !includes(dbCharacters, x));
        const toAddInCache = dbCharacters.filter((x) => !includes(cacheCharacters, x));

        for (const character of toDeleteFromCache) {
            await redisClient.DEL(character.id);
        }

        for (const character of toAddInCache) {
            await redisClient.HSET(character.id, 'sprite', character.sprite);
            await redisClient.HSET(character.id, 'hp', character.hp.toString());
            await redisClient.HSET(character.id, 'attack', character.attack.toString());
            await redisClient.HSET(character.id, 'defense', character.defense.toString());
        }

        await db.disconnect();
        await redisClient.quit();

        return dbCharacters;
    } catch (error) {
        console.error(error);
        await redisClient.quit();

        throw new Error('Unable to get characters');
    }
};

const getCharacterInDB = async (id: string): Promise<Character | null> => {
    try {
        await redisClient.connect();

        const db = await connectToDB();

        const character: Character | null | undefined = await CharacterModel.findById(id);

        await db.disconnect();

        if (!character) {
            await redisClient.DEL(id);
            return null;
        }

        const cacheCharacter = await redisClient.HGETALL(id);

        if ((await redisClient.EXISTS(id)) == 0 || !isEqual(cacheCharacter, character)) {
            await redisClient.HSET(id, 'sprite', character.sprite);
            await redisClient.HSET(id, 'hp', character.hp.toString());
            await redisClient.HSET(id, 'attack', character.attack.toString());
            await redisClient.HSET(id, 'defense', character.defense.toString());

            await redisClient.quit();
            return character;
        }

        await redisClient.quit();
        return character;
    } catch (error) {
        console.error(error);
        await redisClient.quit();

        throw new Error(`Unable to get character with id: ${id}`);
    }
};

const createCharacterInDB = async (
    sprite: string,
    hp: number,
    attack: number,
    defense: number,
): Promise<Character> => {
    try {
        const db = await connectToDB();

        const character = new CharacterModel({
            sprite,
            hp,
            attack,
            defense,
        });

        await character.save();
        await db.disconnect();

        return character;
    } catch (error) {
        console.error(error);
        await redisClient.quit();

        throw new Error(`Unable to create character`);
    }
};

const updateCharacterInDB = async (
    id: string,
    fields: Object,
): Promise<Character | null> => {
    try {
        await redisClient.connect();
        await redisClient.DEL(id);
        await redisClient.disconnect();

        const db = await connectToDB();

        const character: Character | null | undefined = await CharacterModel.findByIdAndUpdate(id, fields, {
            new: true,
        });

        await db.disconnect();

        return character ? character : null;
    } catch (error) {
        console.error(error);
        await redisClient.quit();

        throw new Error(`Unable to update character with id: ${id}`);
    }
};

const deleteCharacterInDB = async (id: string): Promise<void> => {
    try {
        await redisClient.connect();
        await redisClient.DEL(id);
        await redisClient.quit();

        const db = await connectToDB();
        await CharacterModel.findByIdAndDelete(id);
        await db.disconnect();
    } catch (error) {
        console.error(error);
        await redisClient.quit();

        throw new Error(`Unable to delete character with id: ${id}`);
    }
};

export {
    getAllCharactersInDB,
    getCharacterInDB,
    createCharacterInDB,
    updateCharacterInDB,
    deleteCharacterInDB,
};
