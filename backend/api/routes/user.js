const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('../models/user')
const userController = require('../controllers/user');


router.post('/signup', userController.signup);


router.post('/login', userController.login);


router.delete('/:id', userController.delete);

router.get('/getDepartmentStudents/:department', userController.getDepartmentStudents)

router.get('/', userController.getAllStudents);

module.exports = router;