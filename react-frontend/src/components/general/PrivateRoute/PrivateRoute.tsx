import React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";

type PrivateRouteProps = {} & RouteProps;

export class PrivateRoute extends React.Component<PrivateRouteProps, {}> {
    render() {
        const isAuthenticated = true;
        const {children, ...rest} = this.props;

        return (
            <Route
                {...rest}
                render={({location}) =>
                    isAuthenticated ? (
                        this.props.children
                    ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: {from: location}
                            }}
                        />
                    )
                }
            />
        );
    }
}
