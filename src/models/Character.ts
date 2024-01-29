import { Schema, model, models } from 'mongoose';

const CharacterSchema = new Schema(
	{
    attack: {
			type: Number,
			required: true,
		},
    defense: {
			type: Number,
			required: true,
		},
		hp: {
			type: Number,
			required: true,
		},
		sprite: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: false,
	},
);

const Character = models.Character || model('Character', CharacterSchema);

export default Character;