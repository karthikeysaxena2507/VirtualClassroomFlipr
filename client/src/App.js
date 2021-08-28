import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Subject from "./pages/Subject";
import Task from "./pages/Task";
import PageNotFound from "./pages/PageNotFound";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
          <Route exact path = "/" component = {Login} />
          <Route exact path = "/register" component = {Register} />
          <Route exact path = "/home" component = {Home}/>
          <Route exact path = "/subject/:id" component = {Subject}/>
          <Route exact path = "/task/:id" component = {Task} />
          <Route path="*" component = {PageNotFound} />
      </Switch>
  </Router>
  );
}

export default App;