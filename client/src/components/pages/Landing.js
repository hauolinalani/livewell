import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Label } from 'recharts';
import axios from "axios"
import M from "materialize-css";

import LinearLoadingSymbol from "../layout/LinearLoadingSymbol";
import './Landing.css'

const mockData = {
  timedata: [
    {
      date: new Date("2021-09-11"),
      notes: "kjsdlf;fs;sdfjoisfoijfojifoijf",
      sleeptime: 12,
      sleepquality: 5
    },
    {
      date: new Date("2021-09-12"),
      notes: "wheeeeeeeeeeeeeeeeeeeeeee eeeee ee e e e e",
      sleeptime: 3,
      sleepquality: 1
    },
    {
      date: new Date("2021-09-13"),
      notes: "blah blah blah blah blah blahhhhh booooooooooooop",
      sleeptime: 9,
      sleepquality: 4
    },
    {
      date: new Date("2021-09-14"),
      notes: "i like cheese and it is salty wheeeee alsdf abacus",
      sleeptime: 5,
      sleepquality: 10
    },
    {
      date: new Date("2021-09-15"),
      notes: "",
      sleeptime: 8,
      sleepquality: 8
    },
    {
      date: new Date("2021-09-16"),
      notes: "asdfsdf",
      sleeptime: 9,
      sleepquality: 9
    },
    {
      date: new Date("2021-09-17"),
      notes: "",
      sleeptime: 8,
      sleepquality: 10
    },
    {
      date: new Date("2021-09-18"),
      notes: "",
      sleeptime: 8,
      sleepquality: 9
    }
  ],
  maslows: {
    actualization: 2,
    esteem: 3,
    belongingness: 9,
    safety: 10,
    physiological: 6
  }
}
const serverUrl = process.env.REACT_APP_SERVER_URL;
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function Landing(props) {

  const pastDate = new Date(new Date().getTime() - 7 * (24 * 60 * 60 * 1000));
  const currentDate = new Date(new Date().setHours(0,0,0,0));
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState(`${pastDate.getFullYear()}-${pastDate.getMonth()+1}-${pastDate.getDate()}`);
  const [endDate, setEndDate] = useState(`${currentDate.getFullYear()}-${currentDate.getMonth()+1}-${currentDate.getDate()}`);
  const [loading, setLoading] = useState(true);
  const [showPredicted, setShowPredicted] = useState(true);

  useEffect(() => {
    const elem1 = document.querySelectorAll('.startdatepicker');
    const options1 = {
      defaultDate: pastDate,
      setDefaultDate: true,
      autoClose: true,
      maxDate: new Date(),
      onSelect: function(date) {
        setStartDate(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
      }
    }
    M.Datepicker.init(elem1, options1);
    const elem2 = document.querySelectorAll('.enddatepicker');
    const options2 = {
      defaultDate: currentDate,
      setDefaultDate: true,
      autoClose: true,
      maxDate: new Date(),
      onSelect: function(date) {
        setEndDate(`${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`);
      }
    }
    M.Datepicker.init(elem2, options2);
    getData().catch(err => console.log(err));
  }, [])

  useEffect(() => {
    getData().catch(err => console.log(err));
  }, [startDate, endDate])

  async function getData() {
    window.scrollTo(0, 0);
    axios.get(`${serverUrl}/api/datapoints?startDate=${startDate}&endDate=${endDate}`)
      .then(response => {
        setLoading(false);
        window.scrollTo(0, 0);
        const nextDate = new Date(new Date(response.data.timedata[response.data.timedata.length-1].date).getTime() + 1 * (24 * 60 * 60 * 1000));
        const nextNextDate = new Date(nextDate.getTime() + 1 * (24 * 60 * 60 * 1000));
        response.data.timedatawithpredicted = response.data.timedata.map(value => value)
        response.data.timedatawithpredicted[response.data.timedata.length-1].lastReal = true;
        response.data.timedatawithpredicted[response.data.timedata.length-1].predictedsleeptime = response.data.timedata[response.data.timedata.length-1].sleeptime;
        response.data.timedatawithpredicted[response.data.timedata.length-1].predictedsleepquality = response.data.timedata[response.data.timedata.length-1].sleepquality;
        response.data.timedatawithpredicted.push({
          date: nextDate,
          predictedsleeptime: response.data.predictions.sleeptime[0],
          predictedsleepquality: response.data.predictions.sleepquality[0]
        });
        response.data.timedatawithpredicted.push({
          date: nextNextDate,
          predictedsleeptime: response.data.predictions.sleeptime[1],
          predictedsleepquality: response.data.predictions.sleepquality[1]
        });
        setData(response.data);
      })
      .catch(err => {
        setLoading(false);
        window.scrollTo(0, 0);
        M.toast({html: 'An error has occurred. Please try again', classes: "red lighten-1"});
      })
  }

  let content;

  // If loading, render loading symbol
  if (loading || data === null) {
    content = (<React.Fragment>
      <i className="material-icons logo">public</i>
      <LinearLoadingSymbol />
      <h5 className="grey-text text-darken-2">
        Loading...
      </h5>
    </React.Fragment>);
  }
  else {
    content = (
      <React.Fragment>
        <p style={{"textAlign": "center", "marginBottom": 0, "paddingTop": "0.5rem"}}><b>Maslow's Hierarchy of Needs</b></p>
        <ResponsiveContainer height={300} width={500}>
          <RadarChart outerRadius={120} data={[
            {
              type: "Self-actualization",
              value: data.maslows.actualization
            },
            {
              type: "Esteem",
              value: data.maslows.esteem
            },
            {
              type: "Belongingness",
              value: data.maslows.belongingness
            },
            {
              type: "Safety",
              value: data.maslows.safety
            },
            {
              type: "Physiological",
              value: data.maslows.physiological
            },
          ]}>
            <PolarGrid />
            <PolarAngleAxis dataKey="type" />
            <PolarRadiusAxis angle={18} domain={[0, 10]} />
            <Radar dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
          </RadarChart>
        </ResponsiveContainer>
        <p style={{"textAlign": "center", "marginBottom": 0, "paddingTop": "0.5rem"}}><b>Sleep</b></p>
        <div class="switch">
          <label>
            <input type="checkbox" defaultChecked={showPredicted} onChange={e => setShowPredicted(e.target.checked)}></input>
            <span class="lever" style={{marginRight: "3px"}}></span>
            Predictions
          </label>
        </div>
        <ResponsiveContainer height={300} width={500}>
          <LineChart data={showPredicted ? data.timedatawithpredicted : data.timedata} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="sleeptime" stroke="#009688" name="Sleep time" />
            <Line type="monotone" dataKey="sleepquality" stroke="#E5B522" name="Sleep quality" />
            {showPredicted ? (<React.Fragment>
              <Line type="monotone" dataKey="predictedsleeptime" stroke="#009688" name="Sleep time (predicted)" legendType="none" strokeDasharray="5 5" />
              <Line type="monotone" dataKey="predictedsleepquality" stroke="#E5B522" name="Sleep quality (predicted)" legendType="none" strokeDasharray="5 5" />
            </React.Fragment>) : <React.Fragment></React.Fragment>
            }
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <Legend verticalAlign="top" align="center" height={30} />
            <Tooltip labelFormatter={date => `${months[new Date(date).getMonth()]} ${new Date(date).getDate()}`} formatter={(value, name, props) => {
              if (name === "Sleep time") {
                return [`${value} hours`, name, props];
              }
              else if (name === "Sleep quality") {
                return [value, name, props];
              }
              if (!props.payload.lastReal) {
                if (name === "Sleep time (predicted)") {
                  return [`${Math.round(value)} hours`, name, props];
                }
                else {
                  return [Math.round(value), name, props];
                }
              }
              else {
                return [null, null, props];
              }
            }} />
            <XAxis dataKey='date' tickFormatter={date => `${months[new Date(date).getMonth()]} ${new Date(date).getDate()}`} />
            <YAxis dataKey="sleeptime" yAxisId={0} domain={[1, 'auto']}>
              <Label position="insideLeft" angle={-90} offset={30} style={{fill: "#808080"}} >Sleep time</Label>
            </YAxis>
            <YAxis dataKey="sleepquality" yAxisId={1} orientation="right" domain={[1,10]}>
              <Label position="insideRight" angle={90} offset={30} style={{fill: "#808080"}} >Sleep quality</Label>
            </YAxis>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>);
  }

  return (<div className="container">
    <div className="col s12 center-align header-inputs">
      <label className="left-align datepicker">
        Start date
        <input type="text" className="startdatepicker"></input>
      </label>
      <label className="left-align datepicker">
        End date
        <input type="text" className="enddatepicker"></input>
      </label>
      <Link
        to="/add"
        className="add-btn btn btn-large waves-effect waves-light hoverable"
      >
        Add Log
      </Link>
    </div>
    <div className="main-content valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          { content }
        </div>
      </div>
    </div>
  </div>);
}

export default Landing;