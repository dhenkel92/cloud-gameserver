import React from 'react';
import './DetailsTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameConfigButtons } from '../GameConfigButtons/GameConfigButtons';
import { gameConfigStatusToColor } from '../../../../helpers/gameConfigStatusToColor';

interface DetailsTableProps {
  gameName: string;
  gameConfigId: number;
  gameConfigName: string;
  gameConfigStatus: string;
  gameDeploymentId: string;
}

export class DetailsTable extends React.Component<DetailsTableProps> {
  render(): JSX.Element {
    return (
      <div className="detailsTable">
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Type:</div>
          <div className="detailsTableColumnRight">{this.props.gameName}</div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Name:</div>
          <div className="detailsTableColumnRight">{this.props.gameConfigName}</div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Status:</div>
          <div className="detailsTableColumnRight">
            <FontAwesomeIcon icon={faCircle} color={gameConfigStatusToColor(this.props.gameConfigStatus)} /> {this.props.gameConfigStatus}
          </div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <GameConfigButtons
            cloudInstanceId={1}
            gameConfigId={this.props.gameConfigId}
            gameConfigStatus={this.props.gameConfigStatus}
            gameDeploymentId={this.props.gameDeploymentId}
          />
        </div>
      </div>
    );
  }
}
