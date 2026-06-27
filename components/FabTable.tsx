import styles from '@components/SimpleTable.module.css';

import * as React from 'react';

interface FabTableProps {
  data: string[][];
  separatorAfter?: number;
}

const STATUS_OK = new Set(['ACTIVE', 'OPEN', 'APPROVED']);
const STATUS_OFF = new Set(['CLOSED', 'PAID', 'SUSPENDED']);

const FabTable: React.FC<FabTableProps> = ({ data, separatorAfter }) => {
  if (!data || data.length === 0) return null;
  const [header, ...rows] = data;
  const colCount = header.length;

  return (
    <div className={styles.scrollWrapper}>
      <table className={styles.root}>
        <thead>
          <tr>
            {header.map((cell, i) => (
              <td key={i}>{cell}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => {
            const showSeparator = separatorAfter !== undefined && ri === separatorAfter;
            return (
              <React.Fragment key={ri}>
                {showSeparator && (
                  <tr aria-hidden="true">
                    <td
                      colSpan={colCount}
                      style={{
                        padding: '0',
                        height: '1px',
                        background: 'currentColor',
                        opacity: 0.25,
                      }}
                    />
                  </tr>
                )}
                <tr tabIndex={0}>
                  {row.map((cell, ci) => {
                    let statusClass: string | undefined;
                    if (STATUS_OK.has(cell)) statusClass = styles.statusOk;
                    else if (STATUS_OFF.has(cell)) statusClass = styles.statusOff;
                    return (
                      <td key={ci} className={statusClass}>
                        {cell}
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FabTable;
