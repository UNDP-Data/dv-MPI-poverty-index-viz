/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { csv, json } from 'd3-fetch';
import { descending, ascending } from 'd3-array';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import {
  MpiDataType,
  MpiDataTypeDiff,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
  MpiDataTypeNational,
  MpiDataTypeNationalYears,
} from './Types';
import './styles.css';
import { GlobalMpi } from './GlobalMpi';
import { NationalMpi } from './NationalMpi';

function App() {
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const [mpiData, setMpiData] = useState<MpiDataType[]>([]);
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

  const annualizedChangeGlobal = (countryData: object[]) => {
    if (countryData.length > 1) {
      countryData.sort((a, b) =>
        ascending((a as any).lastYear, (b as any).lastYear),
      );
      return (
        (Number((countryData[countryData.length - 1] as any)[headcountR]) -
          Number((countryData[0] as any)[headcountR])) /
        ((countryData[countryData.length - 1] as any).lastYear -
          (countryData[0] as any).lastYear)
      );
    }
    return undefined;
  };
  const dataurl =
    'https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-data-repo/main/';
  useEffect(() => {
    Promise.all([
      csv(`${dataurl}Global-MPI_national.csv`),
      csv(`${dataurl}Global-MPI_area.csv`),
      csv(`${dataurl}Global-MPI_headship.csv`),
      csv(`${dataurl}Global-MPI_national_multiple_years.csv`),
      csv(`${dataurl}MPI_subnational.csv`),
      csv(`${dataurl}MPI_location_multiple_years.csv`),
      csv(`${dataurl}MPI_national_multiple_years.csv`),
      csv(`${dataurl}MPI_year_implementation.csv`),
      json(`${dataurl}country_territory_groups_WBregionBBox.json`),
    ]).then(
      ([
        data,
        urbanRural,
        headship,
        dataYears,
        subnational,
        location,
        nationalYears,
        yearImplementation,
        countriesArray,
      ]) => {
        const glbDataYears = dataYears.map((d: any) => ({
          ...d,
          lastYear:
            (d as any).Year.split('/').length === 2
              ? Number((d as any).Year.split('/')[1])
              : Number((d as any).Year),
        }));
        const dataFetched: MpiDataType[] = [];
        data.forEach((d: any) => {
          const countryDataYears = glbDataYears.filter(
            k => k['country code'] === d['country code'],
          );
          const countryDetails = (countriesArray as any)[
            (countriesArray as any).findIndex(
              (k: any) => k['Alpha-3 code'] === d['country code'],
            )
          ];
          dataFetched.push({
            country: d.Country,
            iso_a3: d['country code'],
            region: d['World region'],
            mpi: d[mpi],
            headcountRatio: d[headcountR],
            year: d.Year,
            intensity: d[intensity],
            povertyWB: Number(d['PPP $2.15 a day 2011-2021']),
            headcountThousands: Number(d['Headcount 2021 thousands']),
            displayDifference: Boolean(d['display difference']),
            coordinates: [
              countryDetails['Longitude (average)'],
              countryDetails['Latitude (average)'],
            ],
            countryData: countryDataYears,
            annualizedChangeHeadcount: annualizedChangeGlobal(countryDataYears),
          });
        });
        const diffFetched: MpiDataTypeDiff[] = [];
        data.forEach((d: any) => {
          const rData = urbanRural.filter(
            k => k['country code'] === d['country code'] && k.Area === 'Rural',
          )[0];
          const uData = urbanRural.filter(
            k => k['country code'] === d['country code'] && k.Area === 'Urban',
          )[0];
          const fData = headship.filter(
            k =>
              k['country code'] === d['country code'] &&
              k.Headship === 'female-headed',
          )[0];
          const mData = headship.filter(
            k =>
              k['country code'] === d['country code'] &&
              k.Headship === 'male-headed',
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
          lastYear:
            (d as any).Year.split('-').length === 2
              ? Number((d as any).Year.split('-')[1])
              : Number((d as any).Year),
          location: d.location,
          mpi: d.MPI,
          headcountRatio: d['Headcount Ratio (H, %)'],
          intensity: +d['Intensity (A, %)'],
        }));
        locationFetched.sort((a, b) => descending(a.lastYear, b.lastYear));
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
          lastYear:
            (d as any).Year.split('-').length === 2
              ? Number((d as any).Year.split('-')[1])
              : Number((d as any).Year),
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
          countryDataValues.sort((a, b) => descending(a.lastYear, b.lastYear));
          const countryDetails = (countriesArray as any)[
            (countriesArray as any).findIndex(
              (k: any) => k['Alpha-3 code'] === country,
            )
          ];
          const indicatorChange = !Number(countryDataValues[0].mpi)
            ? 'headcountRatio'
            : 'mpi';
          const annualizedChangeMPI =
            (countryDataValues[countryDataValues.length - 1].mpi -
              countryDataValues[0].mpi) /
            (countryDataValues[countryDataValues.length - 1].lastYear -
              countryDataValues[0].lastYear);
          const annualizedChangeHeadcount =
            (countryDataValues[countryDataValues.length - 1].headcountRatio -
              countryDataValues[0].headcountRatio) /
            (countryDataValues[countryDataValues.length - 1].lastYear -
              countryDataValues[0].lastYear);
          // sort data by year
          const yearImpl = yearImplementation.filter(
            k => k['country code'] === country,
          )[0];
          nationalYearsAll.push({
            iso_a3: country,
            bbox: countryDetails.boundingBox,
            region: countryDetails.WB_Region,
            coordinates: [
              Number(countryDetails['Longitude (average)']),
              Number(countryDetails['Latitude (average)']),
            ],
            country: countryDataValues[0].country,
            yearImplementation:
              yearImpl !== undefined ? Number(yearImpl.year) : 2020,
            measurements: countryDataValues.length,
            annualizedChangeMPI,
            annualizedChangeHeadcount,
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
                  label: 'Global MPI',
                  key: '1',
                  children: <GlobalMpi mpiData={mpiData} diffData={diffData} />,
                },
                {
                  label: 'National MPI',
                  key: '2',
                  children: (
                    <NationalMpi
                      national={nationalData}
                      nationalYears={nationalYearsData}
                      subnational={subnationalData}
                      location={locationData}
                    />
                  ),
                },
              ]}
            />
          ) : (
            <GlobalMpi mpiData={mpiData} diffData={diffData} />
          )}
          <div>{}</div>
        </>
      ) : null}
    </div>
  );
}

export default App;
