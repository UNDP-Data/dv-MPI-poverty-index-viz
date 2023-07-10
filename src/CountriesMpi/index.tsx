/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { ascending } from 'd3-array';
import {
  MpiDataType,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
} from '../Types';
import { ScatterPlot } from './ScatterPlot';
// import { CountryMap } from './CountryMap';
// <CountryMap data={countrySubnational} country={selectedCountry} />
/* import { ScatterPlotSubnational } from './ScatterPlotSubnational';
<h3>Subnational MPI Data</h3>
{countrySubnational ? (
  <ScatterPlotSubnational
    data={countrySubnational}
    id='subnatScatterPlot'
  />
) : null} */
interface Props {
  national: MpiDataType[];
  subnational: MpiDataTypeSubnational[];
  location: MpiDataTypeLocation[];
}

export function CountriesMpi(props: Props) {
  const { national, subnational, location } = props;
  // const queryParams = new URLSearchParams(window.location.search);
  // const queryCountry = queryParams.get('country');
  const [selectedCountry, setSelectedCountry] = useState<string>('Afghanistan');
  const [rural, setRural] = useState<MpiDataTypeLocation | undefined>(
    undefined,
  );
  const [urban, setUrban] = useState<MpiDataTypeLocation | undefined>(
    undefined,
  );
  const [total, setTotal] = useState<MpiDataType | undefined>(undefined);
  const [year, setYear] = useState<string | undefined>(undefined);
  const [countrySubnational, setCountrySubnational] = useState<
    MpiDataTypeSubnational[] | undefined
  >(undefined);
  national.sort((a, b) => ascending(a.country, b.country));
  console.log('subnational', countrySubnational);
  useEffect(() => {
    const ruralValues = location?.filter(
      k => k.country === selectedCountry && k.location === 'rural',
    )[0];
    setRural(ruralValues);
    const urbanValues = location?.filter(
      k => k.country === selectedCountry && k.location === 'urban',
    )[0];
    setUrban(urbanValues);
    const totalValues = national?.filter(k => k.country === selectedCountry)[0];
    setTotal(totalValues);
    setYear(totalValues.year);
    const subNatValues = subnational?.filter(
      k => k.country === selectedCountry,
    );
    setCountrySubnational(subNatValues);
    console.log('selectedCountry', selectedCountry, urban, rural, total);
  }, [selectedCountry]);
  return (
    <div style={{ width: '1280px', margin: 'auto' }}>
      <div>
        <h3 className='undp-typography'>National values MPI</h3>
      </div>
      <Select
        className='undp-select'
        value={selectedCountry}
        showSearch
        style={{ width: '400px' }}
        onChange={d => {
          setSelectedCountry(national[d as any].country);
        }}
      >
        {national.map((d, i) => (
          <Select.Option className='undp-select-option' key={i}>
            {d.country}
          </Select.Option>
        ))}
      </Select>
      <div className='chart-container margin-top-05'>
        <h6 className='undp-typography margin-bottom-01'>
          Rural and Urban MPI
        </h6>
        <p className='undp-typography small-font'>Year: {year}</p>
        <ScatterPlot
          urban={urban}
          rural={rural}
          total={total}
          id='locationScatterPlot'
        />
        <p className='source'>Source:</p>
      </div>
    </div>
  );
}
