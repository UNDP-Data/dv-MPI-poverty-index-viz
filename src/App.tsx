/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Map } from './Choropleth/Map';
import { MpiDataType, MpiDataTypeUrbanRural } from './Types';
import './styles.css';
import { DumbellChartViz } from './DumbellChartViz';

function App() {
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  const [urbanRuralData, setUrbanRuralData] = useState<MpiDataType[] | undefined>(undefined);

  useEffect(() => {
    Promise.all(
      [
        csv('./data/Global-MPI_national.csv'),
        csv('./data/Global-MPI_rural.csv'),
        csv('./data/Global-MPI_urban.csv')
      ]
    ).then(([data, urban, rural]) => {
      // eslint-disable-next-line no-console
      console.log('data', data, 'urban', urban, 'rural', rural);
      const dataFetched = data.map((d:any) => ({
        country: d.Country,
        iso_a3: d['country code'],
        region: d['World region'],
        mpi: d['MPI (National)'],
        year: +d.Year,
      }));
      const urbanRuralFetched: MpiDataTypeUrbanRural[] =[];
      urban.forEach((d:any) => {
        const rData = rural.filter( k => k['country code'] === d['country code'] )[0]
        urbanRuralFetched.push(
          {
            country: d.Country,
            iso_a3: d['country code'],
            region: d['World region'],
            mpiUrban: d.MPI,
            yearUrban: +d.Year,
            mpiRural: rData.MPI,
            yearRural: +rData.year,
          }          
        )
      });

      // eslint-disable-next-line no-console
      console.log('dataFetched', dataFetched);
      setMpiData(dataFetched);
      setUrbanRuralData(urbanRuralFetched);
    })
  }, []);
  return (
    <div>
      <div>
        {mpiData ? (
            <div><Map data ={mpiData} /></div>
          ) : null
        }
      </div>
      <div>
        {urbanRuralData ? (
          <DumbellChartViz data = {urbanRuralData}  />
        ) :null
        }
      </div>
    </div>
  );
}

export default App;
