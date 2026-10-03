import React from 'react';
import moment from 'moment';
import './DetailsConsole.css';
import { Table } from '../../../general/table/Table';
import { GameDeployment } from '../GameConfigDetailQuery';

interface DetailsConsoleProps {
  deployments: GameDeployment[];
}

const deploymentHeader = ['Server', 'Start time', 'End time', 'Status', 'Costs'];

export const DetailsConsole = (props: DetailsConsoleProps): React.JSX.Element => {
  const entries = [];
  for (const row of props.deployments) {
    const startTime = moment(row.start_time);
    const stopTime = row.stop_time ? moment(row.stop_time) : moment();
    const diff = stopTime.diff(startTime, 'hours', true);
    const costs = Math.round(diff * (row.cost_per_hour ?? 0) * 100) / 100;

    const endtime = row.stop_time ? stopTime.format('HH:mm - DD.MM.YYYY') : '-';
    entries.push([
      row.cloud_instance?.name ?? '-',
      moment(row.start_time).format('HH:mm - DD.MM.YYYY'),
      endtime,
      row.status,
      `${costs} eur`,
    ]);
  }
  return <Table columns={deploymentHeader} data={entries} />;
};
