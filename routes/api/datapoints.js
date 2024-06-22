const router = require('express').Router();
const passport = require("passport");
const predict = require("../../utils/predict")

const Datapoint = require('../../models/Datapoint');
const Prediction = require('../../models/Prediction');

router.get("",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Datapoint.find({ username: req.user.username, date: {
        $gte: req.query.startDate,
        $lte: req.query.endDate
      }})
      .then(docs => {
        const result = {
          "timedata": [],
          "maslows": {
            "actualization": 0,
            "esteem": 0,
            "belongingness": 0,
            "safety": 0,
            "physiological": 0,
          }
        }
        docs.forEach(element => {
          datedata = {
            "date": element.date,
            "notes": element.notes,
            "sleeptime": element.sleeptime,
            "sleepquality": element.sleepquality
          }
          result.timedata.push(datedata);
          result.maslows.actualization += element.actualization;
          result.maslows.esteem += element.esteem;
          result.maslows.belongingness += element.belongingness;
          result.maslows.safety += element.safety;
          result.maslows.physiological += element.physiological;
        });
        if (result.timedata.length != 0) {
          result.maslows.actualization /= result.timedata.length;
          result.maslows.esteem /= result.timedata.length;
          result.maslows.belongingness /= result.timedata.length;
          result.maslows.safety /= result.timedata.length;
          result.maslows.physiological /= result.timedata.length;
        }
        Prediction.find({ username: req.user.username })
          .then(arr => {
            result.predictions = arr[0];
            res.send(result);
          })
          .catch(err => res.status(400).json(err))
      })
      .catch(err => res.status(400).json(err))
  });

router.post("",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    Datapoint.findOne({ "username": req.user.username, "date": new Date(req.body.date) }).then(document => {
      if (document) {
        return res.status(400).json({ error: "Data for this date exists" });
      } else {
        const newData = new Datapoint({
          username: req.user.username,
          date: req.body.date,
          notes: req.body.notes,
          sleeptime: req.body.sleeptime,
          sleepquality: req.body.sleepquality,
          actualization: req.body.actualization,
          esteem: req.body.esteem,
          belongingness: req.body.belongingness,
          safety: req.body.safety,
          physiological: req.body.physiological
        });
        newData.save()
          .then(document => {
            predict(req.user.username);
            res.status(200).json({ success: true })
          })
          .catch(err => console.log(err));
      }
    });
  });

module.exports = router;