const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PredictionSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  sleeptime: {
    type: [Number],
    required: true
  },
  sleepquality: {
    type: [Number],
    required: true
  }
});

module.exports = Prediction = mongoose.model("predictions", PredictionSchema);