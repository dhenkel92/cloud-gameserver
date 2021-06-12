import React from 'react';
import './DetailsTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameConfigButtons } from '../GameConfigButtons/GameConfigButtons';
import { SpinningLoader } from '../../../general/SpinningLoader/SpinningLoader';
import { gameConfigStatusToColor } from '../../../../helpers/gameConfigStatusToColor';

interface DetailsTableProps {
  gameName: string;
  gameConfigId: number;
  gameConfigName: string;
  gameConfigStatus: string;
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
          {this.props.gameConfigStatus === 'STARTING' || this.props.gameConfigStatus === 'STOPPING' ? (
            <SpinningLoader />
          ) : (
            <GameConfigButtons gameConfigId={this.props.gameConfigId} gameConfigStatus={this.props.gameConfigStatus} />
          )}
        </div>
      </div>
    );
  }
}
