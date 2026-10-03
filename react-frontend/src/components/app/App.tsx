import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Callback, Login } from '../login/login';
import { Home } from '../home/Home';
import { PrivateRoute } from '../general/PrivateRoute/PrivateRoute';

export class App extends React.Component {
  render(): React.JSX.Element {
    return (
      <Router>
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/connect/auth0" element={<Callback />} />
            <Route element={<PrivateRoute />}>
              <Route path="/*" element={<Home />} />
            </Route>
          </Routes>
        </div>
      </Router>
    );
  }
}
