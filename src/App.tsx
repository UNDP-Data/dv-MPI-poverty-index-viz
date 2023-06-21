/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Map } from './Choropleth/Map';
import { MpiDataType } from './Types';
import './styles.css';

function App() {
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  // eslint-disable-next-line no-console
  console.log('mpiData', mpiData);

  useEffect(() => {
    csv('./data/Global-MPI_national.csv').then( data => {

        // eslint-disable-next-line no-console
        console.log('data', data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dataFetched = data.map((d:any) => ({
          country: d.Country,
          iso_a3: d['country code'],
          region: d['World region'],
          mpi: d['MPI (National)'],
          year: +d.Year,
        }));
        // eslint-disable-next-line no-console
        console.log('dataFetched', dataFetched);
        setMpiData(dataFetched)
      }
    )
  }, []);
  return (
    <div>
      {mpiData ? (
          <div><Map data ={mpiData} /></div>
        ) : null
      }
    </div>

  );
}

export default App;
