import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import { observer, inject } from 'mobx-react'
import Home from "./components/Home"
import './App.css';
import Dashboard from './components/Dashboard'

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Route path="/" render={() => <Home />} />
          <Route path="/callback" render={() => <Dashboard />} />
        </div>
      </Router>
    );
  }
}

export default observer(App);