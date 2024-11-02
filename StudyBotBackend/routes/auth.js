const express = require('express');
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/create-user', verifyToken, authController.createUser);

module.exports = router;
