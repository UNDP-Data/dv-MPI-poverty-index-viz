/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented, Select } from 'antd';
import { useEffect, useState } from 'react';
import { ascending } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
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
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx07);
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
        <h3 className='undp-typography'>
          National Multidimensional Poverty Index (NMPI)
        </h3>
      </div>
      <p className='undp-typography'>
        A national Multidimensional Poverty Index (MPI) is a poverty measure
        tailored to specific countries, considering their unique circumstances.
        These measures typically emphasize important factors such as healthcare,
        education, and living conditions, while also incorporating other
        relevant dimensions using appropriate local indicators. On this page,
        you can access official statistics of national and subnational MPIs,
        derived from findings obtained through national surveys.
      </p>
      <div className='margin-bottom-08'>
        <p className='undp-typography label'>Select a country</p>
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
      <div>
        {countrySubnational ? (
          <div className='flex-div gap-05'>
            <div className='left-side chart-container'>
              <div className='flex-div flex-space-between'>
                <div>
                  <h6 className='undp-typography margin-bottom-01'>
                    Subnational MPI Data
                  </h6>
                  <p className='undp-typography small-font'>Year: {year}</p>
                </div>
                <div>
                  <Segmented
                    style={{ backgroundColor: '#FFF', padding: '1px' }}
                    className='undp-segmented'
                    options={[
                      { label: 'Map', value: 'map' },
                      {
                        label: 'Intensity vs Headcount ratio',
                        value: 'scatterplot',
                      },
                      { label: 'MPI list', value: 'list' },
                    ]}
                    onResize={undefined}
                    onResizeCapture={undefined}
                    onChange={d => setActiveViz(d as string)}
                  />
                </div>
              </div>
              <div className={activeViz === 'map' ? '' : 'hide'}>
                <div className='countrymap-legend'>
                  <svg width='300px' height='45px'>
                    <g transform='translate(10,20)'>
                      <text
                        x={280}
                        y={-10}
                        fontSize='0.8rem'
                        fill='#212121'
                        textAnchor='end'
                      >
                        Higher MPI
                      </text>
                      {valueArray.map((d, i) => (
                        <g key={i}>
                          <rect
                            x={(i * 280) / valueArray.length}
                            y={1}
                            width={280 / valueArray.length}
                            height={8}
                            fill={colorScaleMPI(valueArray[i] - 0.05)}
                            stroke='#fff'
                          />
                          <text
                            x={(280 * (i + 1)) / valueArray.length}
                            y={25}
                            fontSize={12}
                            fill='#212121'
                            textAnchor='middle'
                          >
                            {d}
                          </text>
                        </g>
                      ))}
                      <text
                        y={25}
                        x={0}
                        fontSize={12}
                        fill='#212121'
                        textAnchor='middle'
                      >
                        0
                      </text>
                    </g>
                  </svg>
                </div>
                <CountryMap countryData={countryData} />
              </div>
              <div className={`${activeViz === 'list' ? '' : 'hide'}`}>
                <LollipopChartViz data={countrySubnational} />
              </div>
              <div className={`${activeViz === 'scatterplot' ? '' : 'hide'}`}>
                <div className='countrymap-legend'>
                  <svg width='300px' height='45px'>
                    <g transform='translate(10,20)'>
                      <text
                        x={280}
                        y={-10}
                        fontSize='0.8rem'
                        fill='#212121'
                        textAnchor='end'
                      >
                        Higher MPI
                      </text>
                      {valueArray.map((d, i) => (
                        <g key={i}>
                          <rect
                            x={(i * 280) / valueArray.length}
                            y={1}
                            width={280 / valueArray.length}
                            height={8}
                            fill={colorScaleMPI(valueArray[i] - 0.05)}
                            stroke='#fff'
                          />
                          <text
                            x={(280 * (i + 1)) / valueArray.length}
                            y={25}
                            fontSize={12}
                            fill='#212121'
                            textAnchor='middle'
                          >
                            {d}
                          </text>
                        </g>
                      ))}
                      <text
                        y={25}
                        x={0}
                        fontSize={12}
                        fill='#212121'
                        textAnchor='middle'
                      >
                        0
                      </text>
                    </g>
                  </svg>
                </div>
                <ScatterPlotSubnational
                  data={countrySubnational}
                  id='subnatScatterPlot'
                />
              </div>
              <p className='source'>
                Source: Compiled from individual National MPI Reports (
                <a
                  href='https://ophi.org.uk/publications/national-mpi-reports/'
                  target='_blank'
                  rel='noreferrer'
                  className='undp-style'
                >
                  https://ophi.org.uk/publications/national-mpi-reports/
                </a>
                )
              </p>
            </div>
            <div className='right-side'>
              <div className='stat-card'>
                <h3>{total?.mpi}</h3>
                <h4>National MPI {selectedCountry}</h4>
                <p>
                  Headcount Ratio: {total?.headcountRatio}%<br />
                  Intensity: {total?.intensity}%
                </p>
              </div>
              <div className='margin-top-06'>
                <h6 className='undp-typography'>
                  Definitions (temporary text)
                </h6>
                <p className='undp-typography small-font'>
                  <strong>Headcount Ratio:</strong> The percentage of poor
                  people in the population
                </p>
                <p className='undp-typography small-font'>
                  <strong>Intensity (of deprivation among the poor): </strong>
                  Intensity (of deprivation among the poor): Average percentage
                  of weighted deprivations experienced by the poor.
                </p>
                <p className='undp-typography small-font'>
                  <strong>MPI (Multidimensional Poverty Index)</strong> is a
                  product of <strong>Headcount ratio</strong> and{' '}
                  <strong>Intensity</strong> of deprivation among the poor.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        <h4 className='undp-typography margin-top-10'>
          {' '}
          Rural vs urban MPI in {selectedCountry}
        </h4>
        <div className='flex-div  margin-top-05'>
          <div className='chart-container'>
            <div className='flex-div flex-space-between'>
              <div>
                <h6 className='undp-typography margin-bottom-01'>
                  Rural and Urban MPI
                </h6>
                <p className='undp-typography small-font'>Year: {year}</p>
              </div>
              <div>
                <div className='legend-container'>
                  <div className='legend-item'>
                    <div
                      className='legend-circle-medium'
                      style={{
                        backgroundColor:
                          UNDPColorModule.categoricalColors.locationColors
                            .urban,
                      }}
                    />
                    <div className='small-font'>Urban</div>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-circle-medium'
                      style={{
                        backgroundColor:
                          UNDPColorModule.categoricalColors.locationColors
                            .rural,
                      }}
                    />
                    <div className='small-font'>Rural</div>
                  </div>
                  <div className='legend-item'>
                    <div
                      className='legend-circle-medium'
                      style={{
                        backgroundColor: '#55606E',
                      }}
                    />
                    <div className='small-font'>Country Total</div>
                  </div>
                </div>
              </div>
            </div>
            <ScatterPlot
              urban={urban}
              rural={rural}
              total={total}
              id='locationScatterPlot'
              country={selectedCountry}
            />
            <p className='source'>
              Source: Compiled from individual National MPI Reports (
              <a
                href='https://ophi.org.uk/publications/national-mpi-reports/'
                target='_blank'
                rel='noreferrer'
                className='undp-style'
              >
                https://ophi.org.uk/publications/national-mpi-reports/
              </a>
              )
            </p>
          </div>
          <div className='stat-card-container'>
            <div className='stat-card' style={{ width: '25%' }}>
              <h3>{rural?.mpi}</h3>
              <h4>Rural MPI</h4>
              <p>
                Headcount Ratio: {rural?.headcountRatio}%<br />
                Intensity: {rural?.intensity}%
              </p>
            </div>
            <div className='stat-card' style={{ width: '25%' }}>
              <h3>{urban?.mpi}</h3>
              <h4>Urban MPI</h4>
              <p>
                Headcount Ratio: {urban?.headcountRatio}%<br />
                Intensity: {urban?.intensity}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
