import React from "react";
import './Home.css';
import {Navigation} from "../navigation/Navigation";

export class Home extends React.Component<{}, {}> {
    render() {
        return (
            <div className="home">
                <div className="navigation column">
                    <Navigation/>
                </div>
                <div className="homeRight column">
                    <div className="homeTopBar">
                        <span>
                        Dashboard
                        </span>
                    </div>
                    <div className="homeContent">

                    </div>
                </div>
            </div>
        );
    }
}
