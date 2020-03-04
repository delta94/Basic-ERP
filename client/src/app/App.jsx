import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import AdminPage from './admin/AdminPage';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/admin">
            {' '}
            <AdminPage />
          </Route>

          <Route exact path="/"></Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
