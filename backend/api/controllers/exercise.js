const mongoose = require('mongoose');
const multer = require('multer');





const Exercise = require('../models/exercise');
const User = require('../models/user');
const Department = require('../models/department');
const department = require('../models/department');
const { response } = require('express');

exports.updateExercise = (req, res, next) => {
    console.log(req.params.pid);
    console.log('test patch')
    Exercise.update({ _id: req.params.pid },
        { $set: { name: req.body.name, steps: req.body.steps } })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        }).catch(err => {
            res.status(500).json();
        })

}

exports.createExercise = (req, res, next) => {
    console.log('start');

    const data = new Exercise({
        _id: mongoose.Types.ObjectId(),
        user: req.body.userId,
        steps: req.body.steps
    });
    console.log('end');
    data.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Step Count Data Saved!",
            data: result
        });

    })
        .catch(err => {
            console.log(err)
            res.status(500).json({
                message: "Failed",
                data: err
            });
        });

}

exports.getExerciseById = (req, res, next) => {
    console.log('start get by id');
    const id = req.params.id;
    console.log(id)
    Exercise.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json(doc);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

}

exports.getUserExerciseById = (req, res, next) => {
    console.log('start get by id');
    const userId = req.params.userId;
    console.log(userId)
    Exercise.find({ user: userId })
        .populate({
            path: 'user',
            populate: {
                path: 'department',
                model: 'Department'
            }
        })
        .exec()
        .then(docs => {
            console.log(docs);
            let response = null;
            if (docs.length > 0 && docs[0].user && docs[0].user.department) {
                const user = docs[0].user;
                const department = docs[0].user.department;
                response = {
                    count: docs.length,
                    username: user.username,
                    email: user.email,
                    matriculation: user.matriculation,
                    department: department.name,
                    totalSteps: docs.reduce((accum, item) => accum + item.steps, 0),
                    exercises: docs.map(doc => {
                        return {
                            date: doc.date,
                            steps: doc.steps
                        }
                    })
                }
            }
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });

}

exports.getDepartmentExerciseById = (req, res, next) => {
    console.log('Get Department Exercise By Id');
    const departmentId = req.params.departmentId;
    console.log(departmentId)

    User.find({ department: departmentId })
        .select('_id')
        .exec()
        .then(docs => {
            const userIds = docs.map(doc => {
                return doc._id;
            });

            Exercise.find({
                user: {
                    $in: userIds
                }
            }).populate({
                path: 'user',
                populate: {
                    path: 'department',
                    model: 'Department'
                }
            }).exec().then(exercises => {
                let response = null;
                if (exercises.length > 0 && exercises[0].user && exercises[0].user.department) {
                    const department = exercises[0].user.department;
                    response = {
                        exercisesCount: exercises.length,
                        department: department.name,
                        studentCount: userIds.length,
                        exercises: exercises.map(doc => {
                            return {
                                name: doc.name,
                                steps: doc.steps,
                                user: doc.user,
                                id: doc._id,
                                date: doc.date,
                                request: {
                                    type: "GET",
                                    url: "http://localhost:3000/stepcounter/" + doc._id
                                }
                            }
                        })
                    }
                }


                res.status(200).json(response);
            })
                .catch(err => {
                    res.status(500).json(err)
                });

        })
        .catch(err => {
            res.status(500).json(err)
        });
}





exports.deleteExercise = (req, res, next) => {
    console.log('delete by id');
    Exercise.remove({ _id: req.params.did })
        .exec()
        .then(doc => {
            console.log(doc);
            res.status(200).json({
                message: 'Data deleted successfully!'
            });
        })

}


exports.getAllDepartmentsExercises = (req, res, next) => {
    console.log('start');
    let response = [];
    Department.find()
        .exec()
        .then(departments => {
            User.find()
                .exec()
                .then(users => {
                    Exercise.find()
                        .exec()
                        .then(exercises => {
                            console.log('Exercises:  ', exercises)
                            departments.forEach((department) => {
                                const result = users.filter(user =>
                                    '' + user.department + '' === '' + department._id + ''
                                );

                                const userIds = result.map(user => {
                                    return String(user._id);
                                });

                                const depExercises = exercises.filter(exercise => {
                                    return userIds.includes(String(exercise.user))
                                })
                                console.log('Department Exercises: ', depExercises)

                                response.push({
                                    id: department._id,
                                    name: department.name,
                                    userCount: userIds.length,
                                    totalSteps: depExercises.reduce((accum, item) => accum + item.steps, 0)
                                });
                            })
                            console.log('All DOne');
                            response.sort(function (a, b) {
                                return a.totalSteps - b.totalSteps;
                            });
                            response.reverse()
                            res.status(200).json(response)
                        })
                        .catch(err => {
                            res.status(200).json(response)
                        })
                })
                .catch(err => {
                    res.status(200).json(response)
                })
        })
        .catch(err => {
            res.status(200).json(response)
        })
}


exports.getAllUserExercises = (req, res, next) => {
    console.log('get all user exercises');
    let response = [];

    User.find()
        .exec()
        .then(users => {
            Exercise.find()
                .exec()
                .then(exercises => {
                    users.forEach((user) => {
                        const userExercises = exercises.filter(exercise =>
                            '' + exercise.user + '' === '' + user._id + ''
                        );

                        

                        response.push({
                            id: user._id,
                            name: user.username,
                            email: user.email,
                            matriculation: user.matriculation,
                            totalSteps: userExercises.reduce((accum, item) => accum + item.steps, 0)
                        });
                    })
                    console.log('All DOne');
                    response.sort(function (a, b) {
                        return a.totalSteps - b.totalSteps;
                    });
                    response.reverse()
                    res.status(200).json(response)
                })
                .catch(err => {
                    res.status(200).json(response)
                })
        })
        .catch(err => {
            res.status(200).json(response)
        })




}







