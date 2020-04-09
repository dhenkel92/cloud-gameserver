import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import './App.css';
import {Login} from "../login/login";
import {Home} from "../home/Home";
import {PrivateRoute} from "../general/PrivateRoute/PrivateRoute";

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <div className="container">
                    <Switch>
                        <Route path="/login">
                            <Login/>
                        </Route>
                        <PrivateRoute path="/">
                            <Home/>
                        </PrivateRoute>
                    </Switch>
                </div>
            </Router>
        );
    }
}

