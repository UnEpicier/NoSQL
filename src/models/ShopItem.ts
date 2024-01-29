import { Schema, model, models } from 'mongoose';

const ShopItemSchema = new Schema(
	{
		cost: {
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

const ShopItem = models.ShopItem || model('ShopItem', ShopItemSchema);

export default ShopItem;