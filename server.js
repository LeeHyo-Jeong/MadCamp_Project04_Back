// 서버 초기화 및 시작

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const diaryRoutes = require('./src/routes/diaryRoutes');
const app = express();
const path = require('path');

app.use(bodyParser.json());
app.use(cors());

// DB 연결
mongoose.connect(process.env.MONGODB_URL, {
}).then(()=>console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/diary", diaryRoutes);

// 정적 파일 제공 설정 (uploads 폴더 내 파일을 클라이언트에 제공)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});