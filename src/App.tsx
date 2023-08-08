/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv, json } from 'd3-fetch';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  MpiDataType,
  MpiDataTypeDiff,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
  MpiDataTypeNational,
  BboxDataType,
} from './Types';
import './styles.css';
import { GlobalMpi } from './GlobalMpi';
import { CountriesMpi } from './CountriesMpi';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const [mpiData, setMpiData] = useState<MpiDataType[] | undefined>(undefined);
  const [diffData, setDiffData] = useState<MpiDataTypeDiff[] | undefined>(
    undefined,
  );
  const [nationalData, setNationalData] = useState<
    MpiDataTypeNational[] | undefined
  >(undefined);
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
      json(
        'https://gist.githubusercontent.com/cplpearce/3bc5f1e9b1187df51d2085ffca795bee/raw/b36904c0c8ea72fdb82f68eb33f29891095deab3/country_codes',
      ),
    ]).then(
      ([
        data,
        rural,
        urban,
        female,
        male,
        national,
        subnational,
        location,
        countries,
      ]) => {
        const countriesKeys = Object.keys(countries as object);
        const countriesArray: { iso_a3: string; boundingBox: BboxDataType }[] =
          [];
        countriesKeys.forEach((key: string) => {
          countriesArray.push({
            iso_a3: (countries as any)[key]['alpha-3'],
            boundingBox: (countries as any)[key].boundingBox,
          });
        });
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
          iso_a3: d['country code'],
          region: '',
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          year: d.Year,
          intensity: +d['Intensity (A, %)'],
          bbox: countriesArray[
            (countriesArray as object[]).findIndex(
              (k: any) => k.iso_a3 === d['country code'],
            )
          ].boundingBox,
        }));
        const subnationalFetched = subnational.map((d: any) => ({
          country: d.country,
          iso_a3: d.ISOcountry,
          region: d['World region'],
          mpi: d.MPI,
          year: d.Year,
          subregion: d['Admin name Region'],
          adminLevel: d['admin level'],
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
    <div
      className='undp-container'
      style={{ maxWidth: '1280px', margin: 'auto' }}
    >
      <h1>
        <i>Work in Progress</i>
      </h1>
      {mpiData &&
      diffData &&
      nationalData &&
      subnationalData &&
      locationData ? (
        <>
          {!queryCountry ? (
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
                  label: 'National MPI',
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
          ) : (
            <CountriesMpi
              national={nationalData}
              subnational={subnationalData}
              location={locationData}
            />
          )}
          <div>---</div>
        </>
      ) : null}
    </div>
  );
}

export default App;
