import { Schema, model, models } from 'mongoose';
import { Character } from '../types/character';

const UserSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
        email: {
			type: String,
			required: true,
		},
        password: {
			type: String,
			required: true,
		},
        currency: {
			type: Number,
			required: true,
		},
        rank: {
			type: Number,
			required: true,
		},
        roster: {
			type: [
				{
					type: Schema.ObjectId,
					ref: 'Character',
					unique: true,
				},
			],
			required: true,
		},
	},
	{
		timestamps: false,
	},
);

const User = models.User || model('User', UserSchema);

export default User;