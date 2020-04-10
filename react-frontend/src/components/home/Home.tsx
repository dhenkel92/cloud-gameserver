import React from "react";
import './Home.css';
import {Navigation} from "../navigation/Navigation";
import {GameConfigList} from "./GameConfigList/GameConfigList";
import colors from '../general/colors/Colors.module.css';
import {PrivateRoute} from "../general/PrivateRoute/PrivateRoute";
import {GameConfigDetails} from "./GameConfigDetails/GameConfigDetails";

export class Home extends React.Component<{}, {}> {
    render() {
        return (
            <div className="home">
                <div className="navigation column">
                    <Navigation/>
                </div>
                <div className="homeRight column">
                    <div className={`homeTopBar  ${colors.primary}`}>
                        <span>
                        Dashboard
                        </span>
                    </div>
                    <div className="homeContent">
                        <PrivateRoute path="/config/:id" render={props => (<GameConfigDetails {...props} name="daniel" />)} />
                        <PrivateRoute exact path="/">
                            <GameConfigList/>
                        </PrivateRoute>
                    </div>
                </div>
            </div>
        );
    }
}
