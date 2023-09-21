/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styled from 'styled-components';

interface Props {
  data: object[];
}

const TableRowEl = styled.div`
  cursor: pointer;
`;

const CellDiv = styled.div`
  padding: 0.5rem 2.5rem 0.5rem 0.75rem;
  font-size: 0.9rem;
`;

export function ListViewTable(props: Props) {
  const { data } = props;
  const columns = Object.keys(data[0]).filter(
    d => d !== 'ISO country code' && d !== 'Country' && d !== 'Survey Year',
  );
  return (
    <div>
      {data ? (
        <div
          style={{ width: 'auto', overflow: 'auto', maxHeight: '70vh' }}
          className='undp-scrollbar'
        >
          <div className='undp-table-head-small undp-table-head-sticky'>
            {columns?.map((d, i) => (
              <div key={i} style={{ width: '10%', minWidth: '6rem' }}>
                <CellDiv>{d}</CellDiv>
              </div>
            ))}
          </div>
          {data.map((row, i) => (
            <TableRowEl key={i} className='undp-table-row'>
              {columns?.map((k, j) => (
                <div
                  key={j}
                  style={{ width: '10%', minWidth: '6rem' }}
                  className='undp-table-row-cell-small'
                >
                  <CellDiv>{(row as any)[k]}</CellDiv>
                </div>
              ))}
            </TableRowEl>
          ))}
        </div>
      ) : null}
    </div>
  );
}
