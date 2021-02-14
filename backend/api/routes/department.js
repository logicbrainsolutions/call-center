const express = require('express');
const router = express.Router();


const departmentController = require('../controllers/department');



router.post('/' , departmentController.createDepartment);


router.get('/',  departmentController.getAllDepartments);



module.exports = router;