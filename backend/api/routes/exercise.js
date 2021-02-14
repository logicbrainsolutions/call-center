const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const exerciseController = require('../controllers/exercise');
const Exercise = require('../models/exercise');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString() + "_" + file.originalname)
    }
})


const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' ||  file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage, limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/' , upload.single('image'),  exerciseController.createExercise);

router.post('/' ,  exerciseController.createExercise);

// router.get('/:id', checkAuth, exerciseController.getExerciseById);

router.get('/getAllDepartmentsExercises',  exerciseController.getAllDepartmentsExercises);
router.get('/getAllUserExercises',  exerciseController.getAllUserExercises);
router.get('/:id', checkAuth, exerciseController.getExerciseById);

router.get('/getUserExerciseById/:userId', exerciseController.getUserExerciseById);

router.get('/getDepartmentExerciseById/:departmentId', exerciseController.getDepartmentExerciseById);



router.delete('/:did', exerciseController.deleteExercise);

router.patch('/:pid', exerciseController.updateExercise);





module.exports = router;