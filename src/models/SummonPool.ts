import { Schema, model, models } from 'mongoose';

const SummonPoolSchema = new Schema(
	{
		characters: {
			type: [
				{
					type: Schema.ObjectId,
					ref: 'Character',
					unique: true,
				},
			],
			required: true,
			default: [],
		},
		cost: {
			type: Number,
			required: true,
		},
		duration: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: false,
	},
);

const SummonPool = models.SummonPool || model('SummonPool', SummonPoolSchema);

export default SummonPool;
