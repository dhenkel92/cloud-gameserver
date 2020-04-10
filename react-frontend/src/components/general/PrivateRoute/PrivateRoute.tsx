import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";

type PrivateRouteProps = {} & RouteProps;

export class PrivateRoute extends React.Component<PrivateRouteProps, {}> {
    render() {
        const isAuthenticated = true;
        const {children, ...rest} = this.props;

        if (!isAuthenticated) {
            return (
                <Route {...rest}><Redirect to={{
                    pathname: "/login",
                }}/></Route>
            )
        }

        return (<Route {...this.props}/>)
    }
}
