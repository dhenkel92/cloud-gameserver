import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import './App.css';
import {Login} from "../login/login";
import {Home} from "../home/Home";

export class App extends React.Component<{}, {}> {
    render() {
        return (
            <Router>
                <div className="container">
                    <Switch>
                        <Route path="/home">
                            <Home/>
                        </Route>
                        <Route path="/">
                            <Login/>
                        </Route>
                    </Switch>
                </div>
            </Router>
        );
    }
}

