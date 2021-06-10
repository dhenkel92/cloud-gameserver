import React from 'react';
import './Navigation.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGamepad, faHome, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import styles from '../general/colors/Colors.module.css';
import { StorageAdapter } from '../../StorageAdapter';

type NavigationProps = {
  redirectCallback: (path: string) => void;
};

export class Navigation extends React.Component<NavigationProps> {
  private storageAdapter = StorageAdapter.getInstance();

  private logout(): void {
    this.storageAdapter.clearAuthToken();
    this.props.redirectCallback('/');
  }

  render(): JSX.Element {
    return (
      <div className={`navigationBar ${styles.surface}`}>
        <div className="navigationBarTop">
          <span>
            <Link to="/">
              <FontAwesomeIcon icon={faGamepad} size="2x" />
            </Link>
          </span>
        </div>
        <div className="listHeading">General</div>
        <div className="navigationBarContent">
          <ul>
            <li>
              <Link to="/">
                <FontAwesomeIcon icon={faHome} /> Home
              </Link>
            </li>
            <li>
              <Link to="/games">
                <FontAwesomeIcon icon={faGamepad} /> Games
              </Link>
            </li>
          </ul>
          <div className="listHeading">User</div>
          <ul>
            <li>
              <Link to="/profile">
                <FontAwesomeIcon icon={faUser} /> Profile
              </Link>
            </li>
            <li>
              <span onClick={this.logout.bind(this)}>
                <FontAwesomeIcon icon={faSignOutAlt} /> Logout
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
