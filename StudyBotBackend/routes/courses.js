const express = require('express');
const courseController = require('../controllers/courseController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', verifyToken, courseController.getAllCourses);
router.post('/', verifyToken, courseController.createCourse);

module.exports = router;
