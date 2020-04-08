import React from 'react';
import './login.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import {Input} from "../general/input/Input";
import {Button} from "../general/button/Button";
import {Link} from "react-router-dom";

export class Login extends React.Component<{}, {}> {
    render() {
        return (
            <div className="login">
                <FontAwesomeIcon icon={faUnlockAlt} size="2x" color="#90caf9"/>
                <h2>Login</h2>
                <div className="form">
                    <Input placeholder="Username"/>
                    <Input placeholder="Password" type="password"/>
                    <Button name="Login" style={{marginTop: '40px'}}/>
                    <Link to="/home">laskdfj</Link>
                </div>
            </div>
        );
    }
}

