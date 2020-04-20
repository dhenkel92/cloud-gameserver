import React from 'react';
import './login.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUnlockAlt} from '@fortawesome/free-solid-svg-icons';
import colors from '../general/colors/Colors.module.css';
import {Input} from "../general/input/Input";
import {Button} from "../general/button/Button";
import gql from 'graphql-tag';
import {Mutation} from '@apollo/react-components';
import {Redirect, RouteComponentProps} from "react-router-dom";
import {StorageAdapter} from "../../StorageAdapter";

const LOGIN_MUTATION = gql`
mutation login($username: String!, $password: String!) {
  login(input: {identifier: $username, password: $password}) {
    jwt
  }
}
`;

interface LoginResponse {
    login: {
        jwt: string,
    }
}

type LoginProps = {} & RouteComponentProps;

export class Login extends React.Component<LoginProps, {}> {
    public state = {
        username: '',
        password: '',
    }
    private storageAdapter = StorageAdapter.getInstance();

    private login(data: LoginResponse) {
        this.storageAdapter.setAuthToken(data.login.jwt);
        this.props.history.push('/');
    }

    render() {
        const token = this.storageAdapter.getAuthToken();
        if (token !== null) {
            return <Redirect to="/"/>;
        }

        const {username, password} = this.state;

        return (
            <Mutation
                mutation={LOGIN_MUTATION}
                variables={this.state}
                onCompleted={(data: any) => this.login(data)}
            >
                {(mutation: any) => (
                    <div className={`login ${colors.background}`}>
                        <FontAwesomeIcon icon={faUnlockAlt} size="2x" className={colors.primaryColor}/>
                        <h2>Login</h2>
                        <div className="form">
                            <Input placeholder="Username" value={username}
                                   onChange={e => this.setState({username: e.target.value})}/>
                            <Input placeholder="Password" type="password" value={password}
                                   onChange={e => this.setState({password: e.target.value})}/>
                            <Button name="Login" className="loginButton" onClick={mutation}/>
                        </div>
                    </div>
                )}
            </Mutation>
        );
    }
}

