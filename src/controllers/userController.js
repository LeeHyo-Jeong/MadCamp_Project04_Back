const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.register = async (req, res) => {
    const {userId, password} = req.body;

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({userId, password: hashedPassword});
        await user.save();

        const accessToken = jwt.sign({ userId: user.userId }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ accessToken });
    } catch(err){
        res.status(500).send("Server error");
    }
};

exports.login = async (req, res) => {
    const {userId, password} = req.body;

    try{
        const user = await User.findOne({userId: userId});
        if (user && await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({userId: user.userId}, process.env.SECRET_KEY, {expiresIn: '1h'});
            res.json({accessToken});
        } else {
            res.status(401).send("Invalid credentials");
        }
    } catch(err){
        console.error(err);
        res.status(500).send("Server error");
    }
}

