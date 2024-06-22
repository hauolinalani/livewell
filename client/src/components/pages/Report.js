import React, { useState, useEffect } from 'react';
import LinearLoadingSymbol from "../layout/LinearLoadingSymbol";
import axios from "axios"

function Report(props) {
  const pastDate = new Date(new Date().getTime() - 7 * (24 * 60 * 60 * 1000));
  const currentDate = new Date(new Date().setHours(0,0,0,0));
  const serverUrl = process.env.REACT_APP_SERVER_URL;

  const [averages, setAverages] = useState(null);
  const [sleepTime, setSleepTime] = useState(0);
  const [sleepQuality, setSleepQuality] = useState(0);

  async function getData() {
    axios.get(`${serverUrl}/api/datapoints?startDate=${pastDate}&endDate=${currentDate}`).then((result) => {
      console.log(result);
      setAverages(result.data.maslows);
      let calcTime = 0;
      let calcQuality = 0;
      if (result.data.timedata.length !== 0) {
        result.data.timedata.forEach(element => {
          calcTime += element.sleeptime / result.data.timedata.length;
          calcQuality += element.sleepquality / result.data.timedata.length;
        });
      }

      setSleepQuality(calcQuality);
      setSleepTime(calcTime);

    })
  }

  useEffect(() => {
    getData().catch(err => console.log(err));
  }, [setAverages, setSleepTime, setSleepQuality])

  let content;

  if (averages == null) {
    return (<React.Fragment>
      <i className="material-icons logo">public</i>
      <LinearLoadingSymbol />
      <h5 className="grey-text text-darken-2">
        Loading...
      </h5>
    </React.Fragment>);
  }
  return (


    <div className="container">
      <div style={{ marginTop: "4rem", marginBottom:"5rem" }} className="row">
        <div className="col s8 offset-s2">
          <h4>
            <b>Wellness Report</b>
          </h4>
          <p className="grey-text">Report for {pastDate.toDateString()} - {currentDate.toDateString()}</p>
        </div>
        <div className="col s8 offset-s2">
          <p style={{marginTop: "1rem"}}><i>Needs</i></p>
          <p>Your physiological and safety needs were {(averages.physiological + averages.safety) > 10 ? "well" : "poorly"} met this week,
            rated <b>{averages.physiological.toFixed(2)} and {averages.safety.toFixed(2)}</b> respectively - these are basic needs like food, water, and security.
            <br></br>
            Belongingness needs, which are the emotional need for interpersonal relationships, were {(averages.belonging) > 5 ? "" : "not"} fully met this week,
            with a rating of <b>{averages.belongingness.toFixed(2)}</b>.
            <br></br>
            Esteem was a <b>{averages.esteem > 5 ? "high" : "low"}</b> point this week, rated <b>{averages.esteem}</b>.
            Your self-actualization {averages.actualization > 5 ? "was high this week" : "could use more work"}, with a rating of {averages.actualization.toFixed(2)}.
            This is the highest level of Maslow's hierarchy and describes your self-fulfillment, and sense of accomplishment.
            <br></br>
            Overall, you rated your self-actualization and belongingness needs as
            <b>{(averages.physiological + averages.safety) > (averages.actualization + averages.belonging) ? " more " : " less "}</b>
            fulfilled than your physiological and security needs.
          </p>

          <p style={{marginTop: "2rem"}}><i>Sleep</i></p>
          <p>You slept <b>{sleepTime.toFixed(2)}</b> hours this week, with a qualtiy of <b>{sleepQuality.toFixed(2)}</b>!
            {(sleepTime > 10 || sleepTime < 7) ?
              ` That amount of sleep could use a bit more consistency - it's highly recommended to get at least 7 hours of sleep, on average. 
                    Sleeping more than 10 hours is also generally detrimental. `
              :
              ` That's quite consistent for sleep time - keep up the good work. `}
            {sleepQuality <= 5 ?
              ` Your sleep quality was quite poor this week - try and maintain a consistent sleep scheudle, and ensure you have good sleep hygine. `
              :
              ` Your sleep quality was doing well this week, so keep up those good habits! `}
          </p>

          <p style={{marginTop: "2rem"}}><i>Recommendations</i></p>
          <p>To fulfill your belongingness needs, some simple ways to connect can be to meet up with a friend for coffee,
            or chat for just 30 minutes on the phone.</p>
          <p>
            Self-actualization looks different for everyone, depending on what your goals are, but writing down your goals
            and setting concrete steps to achieve them is a proven method of increasing your likelihood of reaching them.</p>
          <p>
            Your sleep has improved greatly this week, but to improve your consistency, a great strategy is to set a sleep alarm.
            Just as you set an alarm for waking up, your sleep alarm tells you it's time to sleep, which is great for
            setting a consistent routine and tuning your body's alarm clock.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Report;