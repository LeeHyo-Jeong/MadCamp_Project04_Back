const Diary = require("../models/Diary");
const mongoose = require("mongoose");

exports.addDiary = async (req, res) => {
    const { date, title, contents, type, background } = req.body;
    const userObjectId = new mongoose.Types.ObjectId(req.userObjectId); // userId를 ObjectId로 변환

    let image, audio;

    if(req.file && req.file.fieldname === 'audio'){
        audio = req.file.path;
    }

    if(req.body.image){
        image = req.body.image;
    }

    const newDiary = new Diary({date, title, contents, image, audio, type, userObjectId, background});

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

exports.getDiariesByMonth = async (req, res) => {
  const {month, year} = req.params;
  const userObjectId = new mongoose.Types.ObjectId(req.userObjectId);

  // year와 month를 정수로 변환하고 10진수로 해석
  const startYear = parseInt(year, 10);
  const startMonth = parseInt(month, 10) - 1;
  const endYear = parseInt(year, 10);
  const endMonth = parseInt(month, 10);

  const startDate = new Date(startYear, startMonth, 1);
  const endDate = new Date(endYear, endMonth, 1);

  try{
      const diaries = await Diary.find({
          userObjectId,
          date: {$gte: startDate.toISOString(), $lt: endDate.toISOString()}
      });
      res.status(200).json(diaries);
  } catch(error){
      console.log(error);
      res.status(500).json({message: "Error fetching diaries", error});
  }
};

exports.getDiaryByTypeAndId = async (req, res) => {
    const {type, id} = req.params;

    try{
        const diary = await Diary.findOne({_id: id, type});
        if(!diary){
            return res.status(404).json({message: "Diary not found"});
        }
        res.status(200).json(diary);
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Error fetching diary", error});
    }
}

exports.deleteDiary = async (req, res) => {
    const { id } = req.params;

    try {
        const diary = await Diary.findByIdAndDelete(id);

        if (!diary) {
            return res.status(404).json({ message: 'Diary not found' });
        }
        res.status(200).json({ message: 'Diary deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.editDiary = async (req, res) => {
    const { type, id } = req.params;
    const {date, title, background, contents } = req.body;

    let updateData = { date, title, background };

    if(contents) updateData.contents = contents;
    if(req.files && req.files.audio) updateData.audio = req.files.audio[0].path;
    if(req.body.image) {
        // Base64 문자열이므로 직접 저장
        updateData.image = req.body.image;
    } else if (req.files && req.files.image) {
        updateData.image = req.files.image[0].path;
    }

    try{
        const diary = await Diary.findOneAndUpdate(
            {_id: id, type},
            updateData,
            {new: true},
        );

        if(!diary){
            return res.status(404).json({message: 'Diary not found'});
        }
        res.status(200).json(diary);
    } catch(error){
        res.status(500).json({message: 'Error updating diary', error});
    }
};