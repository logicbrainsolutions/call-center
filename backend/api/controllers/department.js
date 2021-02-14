const mongoose = require('mongoose');



const Department = require('../models/department');

exports.updateDepartment = (req, res, next) => {
    // console.log(req.params.pid);
    // console.log('test patch')
    // Exercise.update({ _id: req.params.pid },
    //     { $set: { name: req.body.name, steps: req.body.steps } })
    //     .exec()
    //     .then(doc => {
    //         console.log(doc);
    //         res.status(200).json(doc);
    //     }).catch(err => {
    //         res.status(500).json();
    //     })

}

exports.createDepartment = (req, res, next) => {

    Department.find({ name: req.body.name })
        .exec()
        .then(departments => {
            if (departments.length > 0) {
                return res.status(409).json({
                    message: 'Department name already exists.'
                })
            } else {
                const data = new Department({
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name
                });
                data.save().then(result => {
                    console.log(result);
                    res.status(201).json({
                        message: "Department Data Saved!",
                        data: result
                    });

                }).catch(err => {
                    console.log(err)
                    res.status(500).json({
                        message: "Failed",
                        data: err
                    });
                });
            }
        })
        .catch(err => {
            res.status(500).json(err)
        });













}

exports.getExerciseById = (req, res, next) => {
    // console.log('start get by id');
    // const id = req.params.id;
    // console.log(id)
    // Exercise.findById(id)
    //     .exec()
    //     .then(doc => {
    //         console.log(doc);
    //         res.status(200).json(doc);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         })
    //     });

}

exports.getUserExerciseById = (req, res, next) => {
    // console.log('start get by id');
    // const id = req.params.id;
    // console.log(id)
    // Exercise.findById(id)
    //     .exec()
    //     .then(doc => {
    //         console.log(doc);
    //         res.status(200).json(doc);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         res.status(500).json({
    //             error: err
    //         })
    //     });

}

exports.getAllDepartments = (req, res, next) => {
    console.log('start');
    Department.find()
        .exec()
        .then(docs => {
            console.log(docs);
            const response = {
                count: docs.length,
                departments: docs
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json(err)
        });

}

exports.deleteExercise = (req, res, next) => {
    // console.log('delete by id');
    // Exercise.remove({ _id: req.params.did })
    //     .exec()
    //     .then(doc => {
    //         console.log(doc);
    //         res.status(200).json({
    //             message: 'Data deleted successfully!'
    //         });
    //     })

}