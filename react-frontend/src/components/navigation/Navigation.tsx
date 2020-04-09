import React from "react";
import './Navigation.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGamepad, faHome, faSignOutAlt, faUser} from '@fortawesome/free-solid-svg-icons';
import {Link} from "react-router-dom";
import styles from '../general/colors/Colors.module.css';

export class Navigation extends React.Component<{}, {}> {
    render() {
        return (
            <div className={`navigationBar ${styles.surface}`}>
                <div className="navigationBarTop">
                    <span>
                        <Link to="/"><FontAwesomeIcon icon={faGamepad} size="2x"/></Link>
                    </span>
                </div>
                <div className="listHeading">
                    General
                </div>
                <div className="navigationBarContent">
                    <ul>
                        <li>
                            <Link to="/home">
                                <FontAwesomeIcon icon={faHome}/> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/games">
                                <FontAwesomeIcon icon={faGamepad}/> Games
                            </Link>
                        </li>
                    </ul>
                    <div className="listHeading">
                        User
                    </div>
                    <ul>
                        <li>
                            <Link to="/profile">
                                <FontAwesomeIcon icon={faUser}/> Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/login">
                                <FontAwesomeIcon icon={faSignOutAlt}/> Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
