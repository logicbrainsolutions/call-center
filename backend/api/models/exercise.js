const mongoose = require('mongoose');


const exerciseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    steps: {type: Number, required: true},
    date: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model('Exercise', exerciseSchema); 