// 라우터 정의

const express = require('express');
const {register, login, userInfo} = require('../controllers/userController');
const verifyToken = require("../middlewares/verifyTokens");

const router = express.Router();

// /auth
router.post('/register', register);
router.post('/login', login);
router.get('/user', verifyToken, userInfo);

module.exports = router;