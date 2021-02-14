const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: {type: String, unique: true},
    matriculation: {type: Number, unique: true}, 
    email: {
        type: String, 
        required: true,
        unique: true, 
        match: /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i},
    password: {type: String, required: true},
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department', required: true},
    age: {type: Number, required: true},
    gender: {type: String, required: true}

}); 

module.exports = mongoose.model('User', userSchema);