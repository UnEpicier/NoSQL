import mongoose from 'mongoose';

const characterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    sprite: {
        type: String,
        required: true,
    },
    hp: {
        type: Number,
        required: true,
    },
    attack: {
        type: Number,
        required: true,
    },
    defense: {
        type: Number,
        required: true,
    },
});

const Character = mongoose.model('Character', characterSchema);

export default Character;
