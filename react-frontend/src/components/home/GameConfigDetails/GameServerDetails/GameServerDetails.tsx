import React from 'react';
import './GameServerDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameServerPort } from '../GameConfigDetailQuery';

interface GameServerDetailsProps {
  dns: string | null;
  privateIp: string | null;
  publicIp: string | null;
  ports: GameServerPort[];
}

export class GameServerDetails extends React.Component<GameServerDetailsProps> {
  render(): React.JSX.Element {
    const ports = this.props.ports.map((port) => (
      <div key={`${port.protocol}:${port.port}`} className="gameServerDetailsTableRow">
        <div className="gameServerDetailsTableColumnLeft">
          <FontAwesomeIcon icon={faCircle} color={port.is_open ? 'green' : 'red'} />
        </div>
        <div className="gameServerDetailsTableColumnRight">{`${port.port}/${port.protocol}`}</div>
      </div>
    ));
    return (
      <div className="gameServerDetailsTable">
        <div className="gameServerDetailsTableRow">
          <div className="gameServerDetailsTableColumnLeft">DNS:</div>
          <div className="gameServerDetailsTableColumnRight">{this.props.dns || '-'}</div>
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
