import React from 'react';
import './GameServerDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

interface GameServerDetailsProps {
  dns: string;
  privateIp: string;
  publicIp: string;
  ports: {
    address: string;
    is_reachable: boolean;
  }[];
}

export class GameServerDetails extends React.Component<GameServerDetailsProps> {
  render(): JSX.Element {
    const ports = this.props.ports.map((port) => (
      <div key={port.address} className="gameServerDetailsTableRow">
        <div className="gameServerDetailsTableColumnLeft">
          <FontAwesomeIcon icon={faCircle} color={port.is_reachable ? 'green' : 'red'} />
        </div>
        <div className="gameServerDetailsTableColumnRight">{port.address}</div>
      </div>
    ));
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
        <hr />
        {ports}
      </div>
    );
  }
}
