import React from "react";
import './Home.css';
import {Navigation} from "../navigation/Navigation";
import {GameConfigList} from "../GameConfigList/GameConfigList";
import colors from '../general/colors/Colors.module.css';

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
                        <GameConfigList />
                    </div>
                </div>
            </div>
        );
    }
}
