import React from 'react';
import './GameServerDetails.css';

interface GameServerDetailsProps {
  dns: string;
  privateIp: string;
  publicIp: string;
}

export class GameServerDetails extends React.Component<GameServerDetailsProps> {
  render(): JSX.Element {
    return (
      <div className="gameServerDetailsTable">
        <div className="gameServerDetailsTableRow">
          <div className="gameServerDetailsTableColumnLeft">DNS:</div>
          <div className="gameServerDetailsTableColumnRight">{this.props.dns === '' ? '-' : this.props.dns}</div>
        </div>
        <hr />
        <div className="gameServerDetailsTableRow">
          <div className="gameServerDetailsTableColumnLeft">Public IP:</div>
          <div className="gameServerDetailsTableColumnRight">{this.props.publicIp}</div>
        </div>
        <hr />
        <div className="gameServerDetailsTableRow">
          <div className="gameServerDetailsTableColumnLeft">Private IP:</div>
          <div className="gameServerDetailsTableColumnRight">{this.props.privateIp}</div>
        </div>
      </div>
    );
  }
}
