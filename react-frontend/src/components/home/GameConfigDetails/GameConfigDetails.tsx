import React from "react";
import './GameConfigDetails.css';
import { RouteComponentProps } from "react-router-dom";

interface GameConfigDetailsPropsParams {
    id: string,
}

type GameConfigDetailsProps = {
    name: string,
} & RouteComponentProps<GameConfigDetailsPropsParams>;

export class GameConfigDetails extends React.Component<GameConfigDetailsProps, {}> {
    render() {
        return (
            <span>Gameconfig {this.props.match.params.id}</span>
        );
    }
}
