const express = require('express')
const { editDiary, deleteDiary, addDiary, getDiaries, getDiariesByMonth, getDiaryByTypeAndId} = require("../controllers/diaryController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyTokens");
const multer = require('multer');

// multer는 파일 업로드를 처리하는 미들웨어
// storage 설정을 통해 파일이 업로드 될 위치(destination)와 파일 이름(filename)을 지정
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // null: indicate that there was no error
        // uploads: destination directory
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // second argument: file name
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage: storage});

// 여러 파일을 처리할 수 있도록 설정
const cpUpload = upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'image', maxCount: 1 }]);


// /diary 경로에 대한 post, get 요청은 verifyToken 미들웨어를 거쳐서
// 토큰을 검증한 후 컨트롤러 함수 실행
// 업로드 미들웨어를 조건부로 사용하여 파일이 존재하는 경우 파일을 업로드
router.post('/', verifyToken, (req, res, next) => {
    const uploadMiddleware = upload.single('audio');
    uploadMiddleware(req, res, (err) => {
        if(err){
            return res.status(400).send({message: 'File upload error', error: err.message});
        }
        console.log("upload succeed");
        next(); // 다음 middleware function을 실행
    });
} , addDiary);

router.get('/:type/:id', verifyToken, getDiaryByTypeAndId);
router.put('/:type/:id', verifyToken, cpUpload, editDiary);
router.get('/month/:year/:month', verifyToken, getDiariesByMonth);
router.get('/', verifyToken, getDiaries);
router.delete('/:id', verifyToken, deleteDiary);


module.exports = router;