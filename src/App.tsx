/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import { MpiDataType, MpiDataTypeDiff } from './Types';
import './styles.css';
import { GlobalMpi } from './GlobalMpi';

function App() {
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  const [diffData, setDiffData] = useState<MpiDataTypeDiff[] | undefined>(
    undefined,
  );

  useEffect(() => {
    Promise.all([
      csv('./data/Global-MPI_national.csv'),
      csv('./data/Global-MPI_rural.csv'),
      csv('./data/Global-MPI_urban.csv'),
      csv('./data/Global-MPI_female.csv'),
      csv('./data/Global-MPI_male.csv'),
    ]).then(([data, rural, urban, female, male]) => {
      const dataFetched = data.map((d: any) => ({
        country: d.Country,
        iso_a3: d['country code'],
        region: d['World region'],
        mpi: d['MPI (National)'],
        headcountRatio:
          d['Headcount ratio: Population in multidimensional poverty (H)'],
        year: +d.Year,
      }));
      const diffFetched: MpiDataTypeDiff[] = [];
      data.forEach((d: any) => {
        const rData = rural.filter(
          k => k['country code'] === d['country code'],
        )[0];
        const uData = urban.filter(
          k => k['country code'] === d['country code'],
        )[0];
        const fData = female.filter(
          k => k['country code'] === d['country code'],
        )[0];
        const mData = male.filter(
          k => k['country code'] === d['country code'],
        )[0];
        if (rData && uData && fData && mData) {
          diffFetched.push({
            country: d.Country,
            iso_a3: d['country code'],
            region: d['World region'],
            year: d.Year,
            mpiUrban: Number(uData.MPI),
            yearUrban: uData.Year,
            mpiRural: Number(rData.MPI),
            yearRural: rData.Year,
            ldiff: Number(rData.MPI) - Number(uData.MPI),
            mpiFemale: Number(fData['Multidimensional Poverty Index']),
            yearFemale: fData.Year,
            mpiMale: Number(mData['Multidimensional Poverty Index']),
            yearMale: fData.Year,
            gdiff:
              Number(fData['Multidimensional Poverty Index']) -
              Number(mData['Multidimensional Poverty Index']),
          });
        }
      });

      setMpiData(dataFetched);
      setDiffData(diffFetched);
    });
  }, []);
  return (
    <div className='undp-container'>
      {mpiData && diffData ? (
        <Tabs
          defaultActiveKey='1'
          className='undp-tabs'
          items={[
            {
              label: 'Global MPI',
              key: '1',
              children: <GlobalMpi mpiData={mpiData} diffData={diffData} />,
            },
            {
              label: 'Countries',
              key: '2',
              children: 'Country selection with country data coming soon',
            },
          ]}
        />
      ) : null}
    </div>
  );
}

export default App;
