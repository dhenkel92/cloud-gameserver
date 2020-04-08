import React from "react";
import './Navigation.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGamepad} from '@fortawesome/free-solid-svg-icons';

export class Navigation extends React.Component<{}, {}> {
    render() {
        return (
            <div className="navigationBar">
                <div className="navigationBarTop">
                    <span>
                        <FontAwesomeIcon icon={faGamepad} size="2x"/>
                    </span>
                </div>
                <div className="navigationBarContent">
                    <p>Content</p>
                </div>
            </div>
        );
    }
}
