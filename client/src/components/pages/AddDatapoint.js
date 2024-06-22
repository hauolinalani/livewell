import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios"
import M from "materialize-css";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function AddImage(props) {

  const [date, setDate] = useState(new Date().setHours(0,0,0,0));
  const [notes, setNotes] = useState("");
  const [sleepTime, setSleepTime] = useState(8);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [actualization, setActualization] = useState(5);
  const [esteem, setEsteem] = useState(5);
  const [belongingness, setBelongingness] = useState(5);
  const [safety, setSafety] = useState(5);
  const [physiological, setPhysiological] = useState(5);

  useEffect(() => {
    const elems = document.querySelectorAll('.datepicker');
    const options = {
      defaultDate: new Date(),
      setDefaultDate: true,
      autoClose: true,
      maxDate: new Date(),
      onSelect: function(date) {
        setDate(new Date(new Date(date).setHours(0,0,0,0)));
      }
    }
    M.Datepicker.init(elems, options);
  }, [])

  function onSubmit(e) {
    e.preventDefault();
    const datapoint = {
      date: date,
      notes: notes,
      sleeptime: sleepTime,
      sleepquality: sleepQuality,
      actualization: actualization,
      esteem: esteem,
      belongingness: belongingness,
      safety: safety,
      physiological: physiological
    };
    axios.post(`${serverUrl}/api/datapoints`, datapoint)
      .then(response => {
        M.toast({html: 'Log added', classes: "green lighten-1"})
        props.history.replace("/");
      })
      .catch(err => M.toast({html: 'An error has occurred. Please try again', classes: "red lighten-1"}));
  };

  return (
    <div className="container">
      <div style={{ marginTop: "4rem", marginBottom:"5rem" }} className="row">
        <div className="col s8 offset-s2">
          <Link to="/" className="btn-flat waves-effect">
            <i className="material-icons left">keyboard_backspace</i> Back to home
          </Link>
          <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <h4>
              <b>Add Log</b>
            </h4>
          </div>
          <form noValidate onSubmit={onSubmit}>
            <div className="col s12">
              <label className="left-align">
                Date
                <input type="text" className="datepicker"></input>
              </label>
            </div>
            <div className="col s12" style={{marginTop: "1rem"}}><h6><b>Maslow's Hierarchy of Needs</b></h6></div>
            <div className="input-field col s12">
              <p className="grey-text">Self-actualization</p>
              <p className="range-field">
                <input type="range" id="actualization" defaultValue="5" min="1" max="10" onChange={e => setActualization(e.target.value)} />
                <label htmlFor="actualization">{actualization}</label>
              </p>
            </div>
            <div className="input-field col s12">
              <p className="grey-text">Esteem</p>
              <p className="range-field">
                <input type="range" id="esteem" defaultValue="5" min="1" max="10" onChange={e => setEsteem(e.target.value)} />
                <label htmlFor="esteem">{esteem}</label>
              </p>
            </div>
            <div className="input-field col s12">
              <p className="grey-text">Belongingness</p>
              <p className="range-field">
                <input type="range" id="belongingness" defaultValue="5" min="1" max="10" onChange={e => setBelongingness(e.target.value)} />
                <label htmlFor="belongingness">{belongingness}</label>
              </p>
            </div>
            <div className="input-field col s12">
              <p className="grey-text">Safety</p>
              <p className="range-field">
                <input type="range" id="safety" defaultValue="5" min="1" max="10" onChange={e => setSafety(e.target.value)} />
                <label htmlFor="safety">{safety}</label>
              </p>
            </div>
            <div className="input-field col s12">
              <p className="grey-text">Physiological</p>
              <p className="range-field">
                <input type="range" id="physiological" defaultValue="5" min="1" max="10" onChange={e => setPhysiological(e.target.value)} />
                <label htmlFor="physiological">{physiological}</label>
              </p>
            </div>

            <div className="col s12" style={{marginTop: "1rem"}}><h6><b>Sleep</b></h6></div>
            <div className="input-field col s12">
              <p className="grey-text">Sleep time</p>
              <p className="range-field">
                <input type="range" id="sleepTime" defaultValue="8" min="1" max="16" onChange={e => setSleepTime(e.target.value)} />
                <label htmlFor="sleepTime">{sleepTime}</label>
              </p>
            </div>
            <div className="input-field col s12">
              <p className="grey-text">Sleep quality</p>
              <p className="range-field">
                <input type="range" id="sleepQuality" defaultValue="5" min="1" max="10" onChange={e => setSleepQuality(e.target.value)} />
                <label htmlFor="sleepQuality">{sleepQuality}</label>
              </p>
            </div>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
              <button
                style={{
                  width: "150px",
                  borderRadius: "3px",
                  letterSpacing: "1.5px",
                  marginTop: "1rem"
                }}
                type="submit"
                className="btn btn-large waves-effect waves-light hoverable"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddImage;