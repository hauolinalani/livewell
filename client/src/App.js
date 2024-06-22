import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from "react-router";
import jwt_decode from "jwt-decode";

import setAuthToken from "./utils/setAuthToken";
import ScrollToTop from "./components/layout/ScrollToTop";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import Landing from "./components/pages/Landing";
import Report from "./components/pages/Report";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import AddDatapoint from "./components/pages/AddDatapoint";

const ProtectedRoute = ({component: Component, user, ...rest}) => {
  return (
    <Route {...rest}  render={props =>
      user ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    } />
  );
};

function App() {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    // Check for token to keep user logged in
    if (token) {
      const decoded = jwt_decode(token);

      // Check for expired token
      const currentTime = Date.now() / 1000; // to get in milliseconds
      if (decoded.exp > currentTime) {
        setUser(decoded);
        setAuthToken(token);
      }
    }
  }, [])

  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Navbar user={user} setUser={setUser} />
        <Switch>
          <Route exact path="/login" render={(props) => <Login {...props} user={user} setUser={setUser} />} />
          <Route exact path="/register" render={(props) => <Register {...props} user={user} />} />
          <ProtectedRoute exact path="/add" user={user} component={AddDatapoint}/>
          <ProtectedRoute exact path="/report" user={user} component={Report}/>
          <ProtectedRoute path="/" component={Landing} user={user} />
        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;