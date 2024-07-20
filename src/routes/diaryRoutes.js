const express = require('express')
const { addDiary, getDiaries } = require("../controllers/diaryController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyTokens");

// /diary 경로에 대한 post, get 요청은 verifyToken 미들웨어를 거쳐서
// 토큰을 검증한 후 컨트롤러 함수 실행
router.post('/', verifyToken, addDiary);
router.get('/', verifyToken, getDiaries);

module.exports = router;