import React from 'react';
import './DetailsTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { GameConfigButtons } from '../GameConfigButtons/GameConfigButtons';

interface DetailsTableProps {
  gameName: string;
  gameConfigName: string;
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
            <FontAwesomeIcon icon={faCircle} color="red" /> Offline
          </div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <GameConfigButtons />
        </div>
      </div>
    );
  }
}
