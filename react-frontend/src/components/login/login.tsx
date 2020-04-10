import React from 'react';
import './login.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {Input} from "../general/input/Input";
import {Link} from "react-router-dom";
import colors from '../general/colors/Colors.module.css';
import buttonStyle from '../general/button/Button.module.css';

export class Login extends React.Component<{}, {}> {
    render() {
        return (
            <div className={`login ${colors.background}`}>
                <FontAwesomeIcon icon={faUnlockAlt} size="2x" className={colors.primaryColor}/>
                <h2>Login</h2>
                <div className="form">
                    <Input placeholder="Username"/>
                    <Input placeholder="Password" type="password"/>
                    <Link to="/" className={`loginButton ${buttonStyle.myButton} ${colors.primary}`}>Login</Link>
                </div>
            </div>
        );
    }
}

