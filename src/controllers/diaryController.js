const Diary = require("../models/Diary");
const mongoose = require("mongoose");

exports.addDiary = async (req, res) => {
    const { date, title, contents } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(req.userObjectId); // userId를 ObjectId로 변환

    const newDiary = new Diary({date, title, contents, userObjectId});

    try{
        await newDiary.save();
        res.status(201).json(newDiary);
    } catch(error){
        res.status(500).json({message: "Error saving diary", error});
    }
};

exports.getDiaries = async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.userObjectId);

    try{
        const diaries = await Diary.find({userObjectId});
        res.status(200).json(diaries);
    } catch(error){
        res.status(500).json({message: "Error fetching diaries", error});
    }
};