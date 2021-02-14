const mongoose = require('mongoose');


const exerciseSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    
    date: { type: Date, default: Date.now }
}); 

module.exports = mongoose.model('Exercise', exerciseSchema); 