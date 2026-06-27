'use client';

import styles from '@components/SimpleTable.module.css';

import * as React from 'react';

export interface FabTool {
  name: string;
  shortName?: string;
  category: string;
  status: string;
  description: string;
  docsUrl?: string;
  imageUrl?: string;
}

interface FabToolTableProps {
  tools: FabTool[];
  separatorAfter?: number;
}

const STATUS_OK = new Set(['ACTIVE']);

const FabToolTable: React.FC<FabToolTableProps> = ({ tools, separatorAfter }) => {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));

  return (
    <div className={styles.scrollWrapper}>
      <table className={styles.root} style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '52%' }} />
          <col style={{ width: '28%' }} />
          <col style={{ width: '20%' }} />
        </colgroup>
        <thead>
          <tr>
            <td>TOOL</td>
            <td>CATEGORY</td>
            <td>STATUS</td>
          </tr>
          <tr aria-hidden="true">
            <td colSpan={3} style={{ padding: '0.4ch 0', background: 'transparent', border: 'none' }} />
          </tr>
        </thead>
        <tbody>
          {tools.map((tool, i) => {
            const isOpen = openIndex === i;
            const showSeparator = separatorAfter !== undefined && i === separatorAfter;

            return (
              <React.Fragment key={i}>
                {showSeparator && (
                  <tr aria-hidden="true">
                    <td colSpan={3} style={{ padding: '0.4ch 0', background: 'transparent', border: 'none' }}>
                      <div style={{ height: '1px', background: 'currentColor', opacity: 0.2 }} />
                    </td>
                  </tr>
                )}
                <tr
                  tabIndex={0}
                  onClick={() => toggle(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggle(i);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                  aria-expanded={isOpen}
                >
                  <td>
                    <span style={{ marginRight: '1ch', opacity: 0.5 }}>{isOpen ? '▾' : '▸'}</span>
                    {tool.shortName ? (
                      <>
                        <span className={styles.nameShort}>{tool.shortName}</span>
                        <span className={styles.nameFull}>{tool.name}</span>
                      </>
                    ) : tool.name}
                  </td>
                  <td>{tool.category}</td>
                  <td className={STATUS_OK.has(tool.status) ? styles.statusOk : undefined}>
                    {tool.status}
                  </td>
                </tr>
                {isOpen && (
                  <tr>
                    <td
                      colSpan={3}
                      style={{ paddingTop: '1ch', paddingBottom: '2ch', paddingLeft: '2ch', opacity: 0.9 }}
                    >
                      <div style={{ marginBottom: '0.75ch' }}>{tool.description}</div>
                      {tool.imageUrl && (
                        <img
                          src={tool.imageUrl}
                          alt={tool.name}
                          style={{ display: 'block', maxWidth: '480px', width: '100%', margin: '1ch 0' }}
                        />
                      )}
                      {tool.docsUrl && (
                        <a href={tool.docsUrl} target="_blank" rel="noopener noreferrer" style={{ opacity: 0.7 }}>
                          ⭢ View Documentation
                        </a>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FabToolTable;
