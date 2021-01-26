import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { StorageAdapter } from '../../../StorageAdapter';

type PrivateRouteProps = RouteProps;

export class PrivateRoute extends React.Component<PrivateRouteProps> {
  private storageAdapter = StorageAdapter.getInstance();

  render(): JSX.Element {
    const token = this.storageAdapter.getAuthToken();
    const isAuthenticated = !!token;
    const { children, ...rest } = this.props;

    if (!isAuthenticated) {
      return (
        <Route {...rest}>
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        </Route>
      );
    }

    return <Route {...this.props} />;
  }
}
