/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv, json } from 'd3-fetch';
import { descending } from 'd3-array';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  MpiDataType,
  MpiDataTypeDiff,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
  MpiDataTypeNational,
  BboxDataType,
  MpiDataTypeNationalYears,
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
  const [nationalYearsData, setNationalYearsData] = useState<
    MpiDataTypeNationalYears[] | undefined
  >(undefined);
  const [subnationalData, setSubnationalData] = useState<
    MpiDataTypeSubnational[] | undefined
  >(undefined);
  const [locationData, setLocationData] = useState<
    MpiDataTypeLocation[] | undefined
  >(undefined);
  // long names csv table headings
  const mpi = 'Multidimensional Poverty Index';
  const headcountR = 'Headcount ratio: Population in multidimensional poverty';
  const intensity = 'Intensity of deprivation among the poor';
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}Global-MPI_national.csv`),
      csv(`${dataurl}Global-MPI_rural.csv`),
      csv(`${dataurl}Global-MPI_urban.csv`),
      csv(`${dataurl}Global-MPI_female.csv`),
      csv(`${dataurl}Global-MPI_male.csv`),
      csv(`${dataurl}MPI_subnational.csv`),
      csv(`${dataurl}MPI_location_multiple_years.csv`),
      csv(`${dataurl}MPI_national_multiple_years.csv`),
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
        subnational,
        location,
        nationalYears,
        countries,
      ]) => {
        const countriesKeys = Object.keys(countries as object);
        const countriesArray: {
          region: string;
          iso_a3: string;
          boundingBox: BboxDataType;
        }[] = [];
        countriesKeys.forEach((key: string) => {
          countriesArray.push({
            iso_a3: (countries as any)[key]['alpha-3'],
            boundingBox: (countries as any)[key].boundingBox,
            region: (countries as any)[key].region,
          });
        });
        const dataFetched = data.map((d: any) => ({
          country: d.Country,
          iso_a3: d['country code'],
          region: d['World region'],
          mpi: d[mpi],
          headcountRatio: d[headcountR],
          year: d.Year,
          intensity: d[intensity],
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
              mpiUrban: {
                mpi: Number(uData[mpi]),
                headcountR: Number(uData[headcountR]),
                intensity: Number(uData[intensity]),
              },
              mpiRural: {
                mpi: Number(rData[mpi]),
                headcountR: Number(rData[headcountR]),
                intensity: Number(rData[intensity]),
              },
              ldiff: {
                mpi: Number(rData[mpi]) - Number(uData[mpi]),
                headcountR:
                  Number(rData[headcountR]) - Number(uData[headcountR]),
                intensity: Number(rData[intensity]) - Number(uData[intensity]),
              },
              mpiFemale: {
                mpi: Number(fData[mpi]),
                headcountR: Number(fData[headcountR]),
                intensity: Number(fData[intensity]),
              },
              mpiMale: {
                mpi: Number(mData[mpi]),
                headcountR: Number(mData[headcountR]),
                intensity: Number(mData[intensity]),
              },
              gdiff: {
                mpi: Number(fData[mpi]) - Number(mData[mpi]),
                headcountR:
                  Number(fData[headcountR]) - Number(mData[headcountR]),
                intensity: Number(fData[intensity]) - Number(mData[intensity]),
              },
            });
          }
        });
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
          firstYear: Number(d.Year.split('-')[0]),
          location: d.location,
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          intensity: +d['Intensity (A, %)'],
        }));
        locationFetched.sort((a, b) => descending(a.firstYear, b.firstYear));
        const nationalFetched = nationalYears.map((d: any) => ({
          country: d.country,
          iso_a3: d['country code'],
          region: '',
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          year: d.Year,
          intensity: +d['Intensity (A, %)'],
          displayMap: Boolean(Number(d['display map'])),
          note: d.note,
          reportName: d['report name'],
          reportUrl: d['url report'],
          placement: d['placement definitions'],
          page: d['page definitions'],
          indicatorFiles: d['indicators files']
            .split(',')
            .filter((k: any) => k !== ''),
          firstYear: Number(d.Year.split('-')[0]),
        }));
        // create an array with all countries with no repetition
        // create an array with country/change and all the data of the country in an array
        const allCountriesYears = [
          ...new Set(nationalYears.map((d: any) => d['country code'])),
        ];
        const nationalYearsAll: MpiDataTypeNationalYears[] = [];
        allCountriesYears.forEach(country => {
          const countryDataValues = nationalFetched.filter(
            k => k.iso_a3 === country,
          );
          countryDataValues.sort((a, b) =>
            descending(a.firstYear, b.firstYear),
          );
          // poverty change: if negative it means there's a decrease in poverty
          // as the latest value is smaller than the first one
          const indicatorChange =
            countryDataValues[0].mpi === '' ? 'headcountRatio' : 'mpi';
          const povertyChange =
            ((countryDataValues[0][indicatorChange] -
              countryDataValues[countryDataValues.length - 1][
                indicatorChange
              ]) /
              countryDataValues[countryDataValues.length - 1][
                indicatorChange
              ]) *
            100;
          // sort data by year
          nationalYearsAll.push({
            iso_a3: country,
            bbox: countriesArray[
              (countriesArray as object[]).findIndex(
                (k: any) => k.iso_a3 === country,
              )
            ].boundingBox,
            region:
              countriesArray[
                (countriesArray as object[]).findIndex(
                  (k: any) => k.iso_a3 === country,
                )
              ].region,
            country: countryDataValues[0].country,
            percentChange: povertyChange,
            countryData: countryDataValues,
            indicatorChange,
          });
        });
        setMpiData(dataFetched);
        setDiffData(diffFetched);
        setNationalData(nationalFetched);
        setSubnationalData(subnationalFetched);
        setLocationData(locationFetched);
        setNationalYearsData(nationalYearsAll);
      },
    );
  }, []);
  return (
    <div className='undp-container'>
      {mpiData &&
      diffData &&
      nationalData &&
      subnationalData &&
      locationData &&
      nationalYearsData ? (
        <>
          {!queryCountry ? (
            <Tabs
              defaultActiveKey='1'
              className='undp-tabs narrow-tabs'
              items={[
                {
                  label: 'National MPI',
                  key: '1',
                  children: (
                    <CountriesMpi
                      national={nationalData}
                      nationalYears={nationalYearsData}
                      subnational={subnationalData}
                      location={locationData}
                    />
                  ),
                },
                {
                  label: 'Global MPI',
                  key: '',
                  children: <GlobalMpi mpiData={mpiData} diffData={diffData} />,
                },
              ]}
            />
          ) : (
            <CountriesMpi
              national={nationalData}
              nationalYears={nationalYearsData}
              subnational={subnationalData}
              location={locationData}
            />
          )}
          <div>{}</div>
        </>
      ) : null}
    </div>
  );
}

export default App;
