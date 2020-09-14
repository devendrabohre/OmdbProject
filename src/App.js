import React from 'react';
import './App.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomePage from './HomePage.js';
import MovieDetails from './MovieDetails.js';

const offlineDiv = (
  <div id="noNetworkDiv" className="noConnectionBox">
    <div className="noConnectionContent">
      <h1>No internet</h1>
      <h5>There is no internet connection!</h5>
      <h6>Check your connection or try again</h6>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact path="/movieDetails/:id"
          render={props =>
            navigator.onLine ? <MovieDetails {...props} /> : offlineDiv
          }
        />
        <Route
          exact path="/"
          render={props =>
            navigator.onLine ? <HomePage {...props} /> : offlineDiv
          }
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
