import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './App.css';
import { Callback, Login } from '../login/login';
import { Home } from '../home/Home';
import { PrivateRoute } from '../general/PrivateRoute/PrivateRoute';

export class App extends React.Component {
  render(): JSX.Element {
    return (
      <Router>
        <div className="container">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/connect/auth0" component={Callback} />
            <PrivateRoute path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    );
  }
}
