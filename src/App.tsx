/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { MpiDataType, MpiDataTypeUrbanRural } from './Types';
import './styles.css';
import { Global } from './global';

function App() {
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  const [urbanRuralData, setUrbanRuralData] = useState<MpiDataTypeUrbanRural[] | undefined>(undefined);

  useEffect(() => {
    Promise.all(
      [
        csv('./data/Global-MPI_national.csv'),
        csv('./data/Global-MPI_rural.csv'),
        csv('./data/Global-MPI_urban.csv')
      ]
    ).then(([data, rural, urban]) => {
      // eslint-disable-next-line no-console
      console.log('data', data, 'urban', urban, 'rural', rural);
      const dataFetched = data.map((d:any) => ({
        country: d.Country,
        iso_a3: d['country code'],
        region: d['World region'],
        mpi: d['MPI (National)'],
        headcountRatio: d['Headcount ratio: Population in multidimensional poverty (H)'],
        year: +d.Year,
      }));
      const urbanRuralFetched: MpiDataTypeUrbanRural[] =[];
      data.forEach((d:any) => {
        const rData = rural.filter( k => k['country code'] === d['country code'] )[0];
        const uData = urban.filter( k => k['country code'] === d['country code'] )[0];
        if (rData && uData){
          urbanRuralFetched.push(
            {
              country: d.Country,
              iso_a3: d['country code'],
              region: d['World region'],
              mpiUrban: Number(uData.MPI),
              yearUrban: uData.Year,
              mpiRural: Number(rData.MPI),
              yearRural: rData.Year,
              diff: Number(rData.MPI) - Number(uData.MPI),
            }          
          )
        }
      });

      // eslint-disable-next-line no-console
      console.log('dataFetched', dataFetched);
      setMpiData(dataFetched);
      setUrbanRuralData(urbanRuralFetched);
    })
  }, []);
  return (
    <div className='undp-container'>
      {mpiData && urbanRuralData ? (
        <Tabs
        defaultActiveKey='1'
        className='undp-tabs'
        items={[
          {
            label: 'Global MPI',
            key: '1',
            children: <Global mpiData ={mpiData} urbanRuralData={urbanRuralData} />
          },
          {
            label: 'Countries',
            key: '2',
            children: ''
          },
        ]}
      />
      ) : null }
    </div>
  );
}

export default App;
