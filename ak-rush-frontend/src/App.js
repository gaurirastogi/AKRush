import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './components/HomePage';
import RusheeDetails from './components/RusheeDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/rushee/:id" component={RusheeDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;