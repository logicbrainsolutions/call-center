const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const mongoose = require('mongoose');



exports.login = (req, res, next) => {
    console.log('Login called')
    User.find({ username: req.body.username })
        .exec()
        .then(users => {
            if (users.length < 1) {
                return res.status(401).json({
                    message: 'Authorization Failed'
                });
            }
            const user = users[0];
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                console.log('Error: ', err)
                console.log('Result:', result)

                if (result) {
                    const token = jwt.sign({
                        username: user.username,
                        userId: users[0]._id
                    },
                        'test', {
                        expiresIn: "1h"
                    });

                    return res.status(200).json({
                        message: 'Authorization Success',
                        token: token,
                        user: user
                    });
                }

                return res.status(401).json({
                    message: 'Authorization Failed'
                });
            });
        })
        .catch();
}


exports.signup = (req, res, next) => {
    User.find({$or:[{username: req.body.username},{matriculation: req.body.matriculation},{email: req.body.email}]})
        .exec()
        .then(user => {
            console.log(user)
            if (user.length > 0) {
                let message = "Username already exists."
                if(user[0].email === req.body.email){
                    message = "Email already exists."
                } 
                if (user[0].matriculation === req.body.matriculation){
                    message = "Matriculation already exists."
                }
                return res.status(409).json({
                    message: message
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash,
                            username: req.body.username,
                            matriculation: req.body.matriculation,
                            department: req.body.department,
                            age: req.body.age,
                            gender: req.body.gender
                        });
                        user.save().then(result => {
                            if (result) {
                                const token = jwt.sign({
                                    username: user.username,
                                    userId: user._id
                                },
                                    'test', {
                                    expiresIn: "1h"
                                });
            
                                return res.status(200).json({
                                    message: 'success',
                                    token: token,
                                    user: user
                                });
                            }




                            res.status(200).json({
                                message: 'User Created'
                            })
                        }).catch();
                    }
                });
            }
        })
        .catch();
}

exports.delete = (req, res, next) => {
    console.log('delete by id');
    User.remove({ _id: req.params.id })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Data deleted successfully!'
            });
        })

}


exports.getDepartmentStudents = (req, res, next) => {
    console.log('get department students');
    console.log(req.params.department)
    User.find({ department: req.params.department })
    .populate('department')
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            users: docs
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json(err)
    });

}


exports.getAllStudents = (req, res, next) => {
    console.log('get department students');
    console.log(req.params.department)
    User.find()
    .populate('department')
    .exec()
    .then(docs => {
        console.log(docs);
        const response = {
            count: docs.length,
            users: docs
        }
        res.status(200).json(response);
    })
    .catch(err => {
        res.status(500).json(err)
    });

}
