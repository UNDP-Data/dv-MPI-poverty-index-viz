/* eslint-disable no-console */
import { useEffect, useState } from 'react';
import { csv } from 'd3-fetch';
import { ListViewTable } from './ListViewTable';

interface Props {
  indicatorFileName: string;
}

export function ListView(props: Props) {
  const { indicatorFileName } = props;
  // console.log('indicatorFileName', indicatorFileName);
  const [mpiData, setMpiData] = useState<object[] | undefined>(undefined);
  useEffect(() => {
    /// read file
    csv(`.././data/indicators/${indicatorFileName.trim()}.csv`).then(data => {
      setMpiData(data);
    });
  }, [indicatorFileName]);
  return (
    <div className='margin-top-08'>
      {mpiData ? (
        <div className='table-container'>
          <ListViewTable data={mpiData} />
        </div>
      ) : null}
    </div>
  );
}
