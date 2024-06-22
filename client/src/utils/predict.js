const axios = require('axios');
const Datapoint = require('../models/Datapoint');
const Prediction = require('../models/Prediction');

require('dotenv').config();
const predictionsApiUrl = process.env.PREDICTIONS_API_URL;

const predict = async(username) => {
  Datapoint.find({ username: username })
    .then(arr => {
      const sleepTime = arr.map(value => value.sleeptime);
      const sleepQuality = arr.map(value => value.sleepquality);
      axios.post(`${predictionsApiUrl}/api/predict`, [sleepTime, sleepQuality])
        .then(response => {
          const predictions = response.data;
          const update = {
            sleeptime: predictions[0],
            sleepquality: predictions[1]
          }
          Prediction.findOneAndUpdate({ username: username }, update, {
            new: true,
            upsert: true,
            useFindAndModify: false
          })
            .then(updated => {
              return;
            })
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
    })
}

module.exports = predict;