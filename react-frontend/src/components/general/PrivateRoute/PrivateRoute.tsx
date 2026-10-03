import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { StorageAdapter } from '../../../StorageAdapter';

export class PrivateRoute extends React.Component {
  private storageAdapter = StorageAdapter.getInstance();

  render(): React.JSX.Element {
    const token = this.storageAdapter.getAuthToken();
    return token ? <Outlet /> : <Navigate to="/login" replace />;
  }
}
