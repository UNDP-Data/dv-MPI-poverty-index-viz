/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styled from 'styled-components';

interface Props {
  data: object[];
}

const CellDiv = styled.div`
  padding: 0.5rem;
  font-size: 0.9rem;
`;

export function ListViewTable(props: Props) {
  const { data } = props;
  const columns = Object.keys(data[0]).filter(
    d => d !== 'ISO country code' && d !== 'Country' && d !== 'Survey Year',
  );
  const columnWidth = 130;
  const tableWidth = columns.length * columnWidth;
  return (
    <div>
      {data ? (
        <div
          style={{ width: 'auto', overflow: 'auto', maxHeight: '70vh' }}
          className='undp-scrollbar'
        >
          <div
            style={{ width: `${tableWidth}px` }}
            className='undp-table-head-small undp-table-head-sticky'
          >
            {columns?.map((d, i) => (
              <div
                key={i}
                style={{ width: `${columnWidth}px`, minWidth: '7rem' }}
              >
                <CellDiv style={{ fontSize: '0.9rem' }}>{d}</CellDiv>
              </div>
            ))}
          </div>
          {data.map((row, i) => (
            <div
              key={i}
              className='undp-table-row'
              style={{ width: `${tableWidth}px` }}
            >
              {columns?.map((k, j) => (
                <div
                  key={j}
                  style={{ width: `${columnWidth}px`, minWidth: '7rem' }}
                  className='undp-table-row-cell-small'
                >
                  <CellDiv style={{ fontSize: '0.9rem' }}>
                    {(row as any)[k]}
                  </CellDiv>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
