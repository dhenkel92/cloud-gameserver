import React from 'react';
import styles from './Table.module.css';

interface TableProps {
  columns: string[];
  data: string[][];
}

export const Table = (props: TableProps): JSX.Element => {
  // eslint-disable-next-line no-console
  console.log('table', props);
  const rows = [];
  for (const row of props.data) {
    rows.push(row.map((col) => <td key={col}>{col}</td>));
  }

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {props.columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key="tableRow">{row}</tr>
        ))}
      </tbody>
    </table>
  );
};
