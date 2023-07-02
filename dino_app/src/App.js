import React, { Component } from 'react';
import './App.css';
import Router from './routers/router';
import './assets/css/style.scss';
//import './assets/css/custom_mobile.scss'; //for scale
import './assets/css/loading.scss';

class App extends Component {

  render() {
    return (
      <Router />
    );
  }
}

export default App;
