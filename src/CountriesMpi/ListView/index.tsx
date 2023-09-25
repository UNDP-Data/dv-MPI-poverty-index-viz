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
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-viz/main/public/data/';
  useEffect(() => {
    /// read file
    csv(`${dataurl}indicators/${indicatorFileName.trim()}.csv`).then(data => {
      setMpiData(data);
    });
  }, [indicatorFileName]);
  return (
    <div className='margin-top-00'>
      {mpiData ? (
        <div className='table-container'>
          <ListViewTable data={mpiData} />
        </div>
      ) : null}
    </div>
  );
}
