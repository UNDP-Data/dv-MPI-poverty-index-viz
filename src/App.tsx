/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  MpiDataType,
  MpiDataTypeDiff,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
} from './Types';
import './styles.css';
import { GlobalMpi } from './GlobalMpi';
import { CountriesMpi } from './CountriesMpi';

function App() {
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  const [diffData, setDiffData] = useState<MpiDataTypeDiff[] | undefined>(
    undefined,
  );
  const [nationalData, setNationalData] = useState<MpiDataType[] | undefined>(
    undefined,
  );
  const [subnationalData, setSubnationalData] = useState<
    MpiDataTypeSubnational[] | undefined
  >(undefined);
  const [locationData, setLocationData] = useState<
    MpiDataTypeLocation[] | undefined
  >(undefined);
  useEffect(() => {
    Promise.all([
      csv('./data/Global-MPI_national.csv'),
      csv('./data/Global-MPI_rural.csv'),
      csv('./data/Global-MPI_urban.csv'),
      csv('./data/Global-MPI_female.csv'),
      csv('./data/Global-MPI_male.csv'),
      csv('./data/MPI_national.csv'),
      csv('./data/MPI_subnational.csv'),
      csv('./data/MPI_location.csv'),
    ]).then(
      ([data, rural, urban, female, male, national, subnational, location]) => {
        const dataFetched = data.map((d: any) => ({
          country: d.Country,
          iso_a3: d['country code'],
          region: d['World region'],
          mpi: d['MPI (National)'],
          headcountRatio:
            d['Headcount ratio: Population in multidimensional poverty (H)'],
          year: d.Year,
          intensity: d['Intensity of deprivation among the poor (A)'],
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
        const nationalFetched = national.map((d: any) => ({
          country: d.country,
          iso_a3: d.ISOcountry,
          region: '',
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          year: d.Year,
          intensity: +d['Intensity (A, %)'],
        }));
        const subnationalFetched = subnational.map((d: any) => ({
          country: d.country,
          iso_a3: d.ISOcountry,
          region: d['World region'],
          mpi: d.MPI,
          year: d.Year,
          subregion: d['Admin name Region'],
          headcountRatio: d['Headcount Ratio (H, %)'],
          intensity: +d['Intensity (A, %)'],
        }));
        const locationFetched = location.map((d: any) => ({
          country: d.country,
          iso_a3: d.ISOcountry,
          region: d['World region'],
          year: d.Year,
          location: d.location,
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          intensity: +d['Intensity (A, %)'],
        }));
        setMpiData(dataFetched);
        setDiffData(diffFetched);
        setNationalData(nationalFetched);
        setSubnationalData(subnationalFetched);
        setLocationData(locationFetched);
      },
    );
  }, []);
  return (
    <div className='undp-container'>
      {mpiData &&
      diffData &&
      nationalData &&
      subnationalData &&
      locationData ? (
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
              children: (
                <CountriesMpi
                  national={nationalData}
                  subnational={subnationalData}
                  location={locationData}
                />
              ),
            },
          ]}
        />
      ) : null}
    </div>
  );
}

export default App;
