const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    contents: {
        type: String,
    },
    image: {
        type: String // base64 encoded image data
    },
    audio: {
        type: String // base64 encoded audio data
    },
    type: {
      type: String,
      required: true // text, image, audio
    },
    userObjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    background: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Diary', diarySchema);