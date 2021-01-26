import React from 'react';
import './DetailsTable.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';

export class DetailsTable extends React.Component {
  render(): JSX.Element {
    return (
      <div className="detailsTable">
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Type:</div>
          <div className="detailsTableColumnRight">Minecraft</div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Name:</div>
          <div className="detailsTableColumnRight">The pack - v1.0.0</div>
        </div>
        <hr />
        <div className="detailsTableRow">
          <div className="detailsTableColumnLeft">Status:</div>
          <div className="detailsTableColumnRight">
            <FontAwesomeIcon icon={faCircle} color="red" /> Offline
          </div>
        </div>
      </div>
    );
  }
}
