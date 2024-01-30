/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ListViewTable } from './ListViewTable';

interface Props {
  indicatorFileName: string;
}

export function ListView(props: Props) {
  const { indicatorFileName } = props;
  const [mpiData, setMpiData] = useState<object[] | undefined>(undefined);
  const [tableTitle, setTableTitle] = useState<string>('');
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-data-repo/main/';
  useEffect(() => {
    /// read file
    csv(`${dataurl}indicators/${indicatorFileName.trim()}.csv`).then(data => {
      setMpiData(data);
    });
    const indicatorSplit = indicatorFileName.split('_')[1];
    if (indicatorSplit !== undefined)
      setTableTitle(
        indicatorSplit === '1'
          ? 'Locations, administrative level 1'
          : 'Locations, administrative level 2',
      );
  }, [indicatorFileName]);
  return (
    <div className='margin-top-00'>
      {tableTitle !== '' ? (
        <p className='margin-top-10 undp-typography'>{tableTitle}</p>
      ) : null}
      {mpiData ? (
        <div className='table-container'>
          <ListViewTable data={mpiData} />
        </div>
      ) : null}
    </div>
  );
}
