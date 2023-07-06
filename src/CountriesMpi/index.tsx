/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { csv } from 'd3-fetch';
import { useEffect, useState } from 'react';
import {
  MpiDataType,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
} from '../Types';
import { ScatterPlot } from './ScatterPlot';

export function CountriesMpi() {
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [nationalData, setNationalData] = useState<MpiDataType[] | undefined>(
    undefined,
  );
  const [subnationalData, setSubnationalData] = useState<
    MpiDataTypeSubnational[] | undefined
  >(undefined);
  const [locationData, setLocationData] = useState<
    MpiDataTypeLocation[] | undefined
  >(undefined);
  const [countries, setCountries] = useState<string[]>([]);
  const [rural, setRural] = useState<MpiDataTypeLocation | undefined>();
  const [urban, setUrban] = useState<MpiDataTypeLocation | undefined>();
  const [total, setTotal] = useState<MpiDataType | undefined>();
  useEffect(() => {
    Promise.all([
      csv('./data/MPI_national.csv'),
      csv('./data/MPI_subnational.csv'),
      csv('./data/MPI_location.csv'),
    ]).then(([national, subnational, location]) => {
      const nationalFetched = national.map((d: any) => ({
        country: d.country,
        iso_a3: d.ISOcountry,
        region: '',
        mpi: d.MPI,
        headcountRatio: d[' Headcount Ratio (H, %)'],
        year: d.Year,
        intensity: +d['Intensity (A, %)'],
      }));
      setNationalData(nationalFetched);
      const subnationalFetched = subnational.map((d: any) => ({
        country: d.country,
        iso_a3: d.ISOcountry,
        region: d['World region'],
        mpi: d.MPI,
        year: d.Year,
        subregion: d['Admin name Region'],
        headcountRatio: d[' Headcount Ratio (H, %)'],
        intensity: +d['Intensity (A, %)'],
      }));
      setSubnationalData(subnationalFetched);
      const locationFetched = location.map((d: any) => ({
        country: d.country,
        iso_a3: d.ISOcountry,
        region: d['World region'],
        year: d.Year,
        location: d.location,
        mpi: d.MPI,
        headcountRatio: d[' Headcount Ratio (H, %)'],
        intensity: +d['Intensity (A, %)'],
      }));
      setLocationData(locationFetched);
      setCountries([...new Set(nationalData?.map(d => d.country))]);
      if (queryCountry) setSelectedCountry(queryCountry);
      else if (selectedCountry === '') setSelectedCountry(countries[0]);
      // eslint-disable-next-line no-console
      console.log('countries', selectedCountry, countries);
    });
  }, []);
  useEffect(() => {
    setSelectedCountry(selectedCountry);
    if (selectedCountry !== '' && selectedCountry !== undefined) {
      const ruralValues = locationData?.filter(
        d => d.country === selectedCountry && d.location === 'rural',
      )[0];
      setRural(ruralValues);
      const urbanValues = locationData?.filter(
        d => d.country === selectedCountry && d.location === 'urban',
      )[0];
      setUrban(urbanValues);
      const totalValues = nationalData?.filter(
        d => d.country === selectedCountry,
      )[0];
      setTotal(totalValues);
      // eslint-disable-next-line no-console
      console.log(
        'urban, rural, total',
        selectedCountry,
        urbanValues,
        ruralValues,
        totalValues,
      );
    }
  }, [selectedCountry]);
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {nationalData &&
      subnationalData &&
      locationData &&
      countries.length > 0 ? (
        <>
          <div>
            <h2 className='undp-typography'>National values MPI</h2>
          </div>
          <Select
            className='undp-select'
            value={selectedCountry}
            showSearch
            style={{ width: '400px' }}
            onChange={d => {
              setSelectedCountry(d);
            }}
          >
            {countries.map(d => (
              <Select.Option className='undp-select-option' key={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
          <div>{urban?.intensity}</div>
          <div>{rural?.intensity}</div>
          <div>{total?.intensity}</div>
          <ScatterPlot urban={urban} rural={rural} total={total} />
        </>
      ) : null}
    </>
  );
}
