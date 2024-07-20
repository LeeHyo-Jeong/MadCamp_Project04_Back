// 서버 초기화 및 시작

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./src/routes/auth');
const diaryRoutes = require('./src/routes/diaryRoutes');
const app = express();

app.use(bodyParser.json());
app.use(cors());

// DB 연결
mongoose.connect(process.env.MONGODB_URL, {
}).then(()=>console.log("MongoDB connected"))
    .catch(err => console.log(err));

app.use("/auth", authRoutes);
app.use("/diary", diaryRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});