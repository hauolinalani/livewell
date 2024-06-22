import React, { useState } from 'react';
import { Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import classnames from "classnames";
import axios from "axios"
import setAuthToken from "../../utils/setAuthToken";

const serverUrl = process.env.REACT_APP_SERVER_URL;

function Login(props) {

  if (props.user) {
    props.history.replace("/");
  }

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function onSubmit(e) {
    e.preventDefault();
    const userData = {
      username: username,
      password: password
    };
    axios.post(`${serverUrl}/api/auth/login`, userData)
      .then(response => {
        const { token } = response.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        props.setUser(decoded);
        props.history.replace("/");
      })
      .catch(err => setErrors(err.response.data));
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
              <b>Login</b>
            </h4>
            <p className="grey-text text-darken-1">
              Don't have an account? <Link to="/register" className="teal-text">Register</Link>
            </p>
          </div>
          <form noValidate onSubmit={onSubmit}>
            <div className="input-field col s12">
              <input
                onChange={e => {
                  setUsername(e.target.value);
                  setErrors({});
                }}
                value={username}
                error={errors.error}
                id="username"
                type="text"
                className={classnames("", {
                  invalid: errors.error
                })}
              />
              <label htmlFor="username">Username</label>
            </div>
            <div className="input-field col s12">
              <input
                onChange={e => {
                  setPassword(e.target.value);
                  setErrors({});
                }}
                value={password}
                error={errors.error}
                id="password"
                type="password"
                className={classnames("", {
                  invalid: errors.error
                })}
              />
              <label htmlFor="password">Password</label>
              <span className="red-text">
                            {errors.error}
                        </span>
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
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;