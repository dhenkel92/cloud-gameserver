import React from 'react';
import moment from 'moment';
import './DetailsConsole.css';
import { Table } from '../../../general/table/Table';
// import color from '../../../general/colors/Colors.module.css';

interface DetailsConsoleProps {
  // eslint-disable-next-line
  deployments: any[];
}

const deploymentHeader = ['Server', 'Start time', 'End time', 'Status', 'Costs'];

export const DetailsConsole = (props: DetailsConsoleProps): JSX.Element => {
  const entries = [];
  for (const row of props.deployments) {
    const startTime = moment(row.attributes.start_time);
    const stopTime = row.attributes.stop_time ? moment(row.attributes.stop_time) : moment();
    const diff = stopTime.diff(startTime, 'hours', true);
    const costs = Math.round(diff * row.attributes.cost_per_hour * 100) / 100;

    const endtime = row.attributes.stop_time ? stopTime.format('HH:mm - DD.MM.YYYY') : '-';
    entries.push([
      row.attributes.cloud_instance.data.attributes.name,
      moment(row.attributes.start_time).format('HH:mm - DD.MM.YYYY'),
      endtime,
      row.attributes.status,
      `${costs} eur`,
    ]);
  }
  return <Table columns={deploymentHeader} data={entries} />;
};
