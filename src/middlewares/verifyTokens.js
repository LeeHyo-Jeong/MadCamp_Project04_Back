const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const accessTokenHeader = req.headers['authorization'];
    const accessToken = accessTokenHeader.split(' ')[1].replace(/['"]+/g, '');

    if(!accessToken){
        return res.status(403).send("Token is required");
    }

    // verifyToken 미들웨어에서 userObjectId를 추출하고 요청 객체에 설정
    jwt.verify(accessToken, process.env.SECRET_KEY, (err, decoded) => {
        if(err){
            return res.status(500).send("Invalid token");
        }
        req.userObjectId = decoded.userId;
        next();
    })
};

module.exports = verifyToken;