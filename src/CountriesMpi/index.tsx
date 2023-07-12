/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ascending } from 'd3-array';
import {
  MpiDataTypeNational,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
} from '../Types';
import { ScatterPlot } from './ScatterPlot';
import { CountryMap } from './CountryMap';
import { ScatterPlotSubnational } from './ScatterPlotSubnational';
import { LollipopChartViz } from './LollipopChartViz';

interface Props {
  national: MpiDataTypeNational[];
  subnational: MpiDataTypeSubnational[];
  location: MpiDataTypeLocation[];
}

export function CountriesMpi(props: Props) {
  const { national, subnational, location } = props;
  // const queryParams = new URLSearchParams(window.location.search);
  // const queryCountry = queryParams.get('country');
  const [selectedCountry, setSelectedCountry] = useState<string>('Malawi');
  const [rural, setRural] = useState<MpiDataTypeLocation | undefined>(
    undefined,
  );
  const [urban, setUrban] = useState<MpiDataTypeLocation | undefined>(
    undefined,
  );
  const [total, setTotal] = useState<MpiDataTypeNational | undefined>(
    undefined,
  );
  const [year, setYear] = useState<string | undefined>(undefined);
  const [countrySubnational, setCountrySubnational] = useState<
    MpiDataTypeSubnational[] | undefined
  >(undefined);
  const [countryData, setCountryData] = useState<
    MpiDataTypeNational | undefined
  >(undefined);
  const [activeViz, setActiveViz] = useState<string>('map');
  national.sort((a, b) => ascending(a.country, b.country));

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
    setCountryData(
      national.filter(
        (d: MpiDataTypeNational) => d.country === selectedCountry,
      )[0],
    );
  }, [selectedCountry]);
  return (
    <div style={{ width: '1280px', margin: 'auto' }}>
      <div>
        <h3 className='undp-typography'>National values MPI</h3>
      </div>
      <div className='margin-bottom-05'>
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
      </div>
      <div className='margin-bottom-03'>
        <p className='undp-typograpy label'>Select a view</p>
        <Segmented
          className='undp-segmented-small'
          options={[
            { label: 'Map', value: 'map' },
            { label: 'Intensity vs Headcount ratio', value: 'scatterplot' },
            { label: 'MPI list', value: 'list' },
          ]}
          onResize={undefined}
          onResizeCapture={undefined}
          onChange={d => setActiveViz(d as string)}
        />
      </div>
      <div>
        {countrySubnational ? (
          <>
            <div className={activeViz === 'map' ? '' : 'hide'}>
              <CountryMap countryData={countryData} />
            </div>
            <div
              className={`chart-container margin-top-05 ${
                activeViz === 'list' ? '' : 'hide'
              }`}
            >
              <LollipopChartViz data={countrySubnational} />
            </div>
            <div
              className={`chart-container margin-top-05 ${
                activeViz === 'scatterplot' ? '' : 'hide'
              }`}
            >
              <h6 className='undp-typography margin-bottom-01'>
                Subnational MPI Data
              </h6>
              <p className='undp-typography small-font'>Year: {year}</p>
              <div>
                <ScatterPlotSubnational
                  data={countrySubnational}
                  id='subnatScatterPlot'
                />
              </div>
            </div>
          </>
        ) : null}
        <h3> Rural vs urban MPI</h3>
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
            country={selectedCountry}
          />
          <p className='source'>Source:</p>
        </div>
      </div>
    </div>
  );
}
