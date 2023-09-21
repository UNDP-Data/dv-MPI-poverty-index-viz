/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented, Select, Radio, RadioChangeEvent } from 'antd';
import { Key, useEffect, useState } from 'react';
import { ascending } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import {
  MpiDataTypeNational,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
} from '../Types';
import { Map } from '../Components/Choropleth/Map';
import { ScatterPlot } from './ScatterPlot';
import { CountryMap } from './CountryMap';
import { ScatterPlotSubnational } from './ScatterPlotSubnational';
import { LollipopChartViz } from './LollipopChartViz';
import { ListView } from './ListView';

interface Props {
  national: MpiDataTypeNational[];
  subnational: MpiDataTypeSubnational[];
  location: MpiDataTypeLocation[];
}

export function CountriesMpi(props: Props) {
  const { national, subnational, location } = props;
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
  const [indicatorFiles, setIndicatorFiles] = useState<string[] | undefined>(
    undefined,
  );
  const [activeViz, setActiveViz] = useState<string>('map');
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx07);
  const [sortedBy, setSortedBy] = useState('mpi');

  national.sort((a, b) => ascending(a.country, b.country));
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const countryList = [
    ...new Set(
      subnational.map((d: MpiDataTypeSubnational) => d.country.trim()),
    ),
  ].sort();
  const defaultCountry = queryCountry || countryList[0];
  const [selectedCountry, setSelectedCountry] =
    useState<string>(defaultCountry);
  const subNat = subnational?.filter(k => k.country.trim() === selectedCountry);
  const [adminLevels, setAdminLevels] = useState<string[]>([
    ...new Set(subNat.map((d: MpiDataTypeSubnational) => d.adminLevel)),
  ]);
  const [selectedAdminLevel, setSelectedAdminLevel] = useState<string>(
    adminLevels[0],
  );
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
    setIndicatorFiles(
      national.filter(
        (d: MpiDataTypeNational) => d.country === selectedCountry,
      )[0].indicatorFiles,
    );
    setAdminLevels([
      ...new Set(subNatValues.map((d: MpiDataTypeSubnational) => d.adminLevel)),
    ]);
    if (
      [
        ...new Set(
          subNatValues.map((d: MpiDataTypeSubnational) => d.adminLevel),
        ),
      ].length === 1
    ) {
      setSelectedAdminLevel(
        [
          ...new Set(
            subNatValues.map((d: MpiDataTypeSubnational) => d.adminLevel),
          ),
        ][0],
      );
    }
  }, [selectedCountry]);
  return (
    <div>
      <h3 className='undp-typography margin-bottom-07'>
        National Multidimensional Poverty Index (MPI) {queryCountry || ''}
      </h3>
      <p className='undp-typography'>
        A national Multidimensional Poverty Index (MPI) is a poverty measure
        tailored to specific countries, considering their unique circumstances.
        These measures typically emphasize important factors such as healthcare,
        education, and living conditions, while also incorporating other
        relevant dimensions using appropriate local indicators.
      </p>
      {national ? (
        <div className='flex-div flex-wrap gap-07'>
          <Map data={national} />
          <div className='chart-explanation'>
            <h5 className='undp-typography margin-top-00'>Key Definitions</h5>
            <div>
              <div className='definitionDiv'>
                <h6 className='undp-typography'>
                  Multidimensional Poverty Index (MPI)
                </h6>
                <p className='undp-typography small-font'>
                  Multidimensional Poverty Index is calculated as the product of
                  the headcount ratio and the intensity of poverty. It combines
                  measures to provide a comprehensive assessment of
                  multidimensional poverty, taking into account both the
                  prevalence and severity of poverty among individuals in a
                  population.
                </p>
              </div>
              <div className='definitionDiv'>
                <h6 className='undp-typography'>Headcount Ratio</h6>
                <p className='undp-typography small-font'>
                  The headcount ratio measures the percentage of individuals in
                  a population who are considered multidimensionally poor,
                  indicating the proportion of people experiencing poverty
                  across multiple dimensions.
                </p>
              </div>
              <div className='definitionDiv'>
                <h6 className='undp-typography'>Intensity of poverty</h6>
                <p className='undp-typography small-font'>
                  The intensity of poverty is the average proportion of weighted
                  indicators in which multidimensionally poor individuals are
                  deprived. It provides insights into the extent or severity of
                  deprivation experienced by those classified as
                  multidimensionally poor.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <hr className='undp-style light margin-bottom-06' />
      {!queryCountry ? (
        <div className='margin-bottom-08'>
          <p className='undp-typography label'>Select a country</p>
          <Select
            options={countryList.map(country => ({
              label: country,
              value: country,
            }))}
            className='undp-select'
            value={selectedCountry}
            showSearch
            style={{ width: '400px' }}
            onChange={d => setSelectedCountry(d.trim())}
          />
        </div>
      ) : null}
      {countrySubnational ? (
        <div className='flex-div flex-wrap'>
          <div className='chart-container flex-chart'>
            <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
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
            <div className='legend-interactionBar'>
              <div className='flex-div flex-space-between'>
                {activeViz !== 'list' ? (
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
                ) : (
                  <div className='flex-div' style={{ alignItems: 'center' }}>
                    <div style={{ flexBasis: '80px' }}>
                      <p className='undp-typography small-font'>Sort by:</p>
                    </div>
                    <div>
                      <Radio.Group
                        defaultValue='mpi'
                        onChange={(el: RadioChangeEvent) =>
                          setSortedBy(el.target.value)
                        }
                        className='margin-bottom-05'
                      >
                        <Radio className='undp-radio' value='mpi'>
                          MPI
                        </Radio>
                        <Radio className='undp-radio' value='intensity'>
                          Intensity
                        </Radio>
                        <Radio className='undp-radio' value='headcountRatio'>
                          Headcount Ratio
                        </Radio>
                        <Radio className='undp-radio' value='subregion'>
                          Subregion name
                        </Radio>
                      </Radio.Group>
                    </div>
                  </div>
                )}
                {adminLevels && adminLevels.length > 1 ? (
                  <div
                    className='flex-div'
                    style={{
                      alignItems: 'center',
                      flexBasis: '190px',
                      minWidth: '190px',
                    }}
                  >
                    <div>
                      <p className='undp-typography small-font'>Admin level:</p>
                    </div>
                    <div>
                      <Radio.Group
                        value={selectedAdminLevel}
                        onChange={(el: RadioChangeEvent) => {
                          setSelectedAdminLevel(el.target.value);
                        }}
                        className='margin-bottom-05'
                      >
                        {adminLevels.map((d, i) => (
                          <Radio key={i} className='undp-radio' value={d}>
                            {d}
                          </Radio>
                        ))}
                      </Radio.Group>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
            <div className={activeViz === 'map' ? '' : 'hide'}>
              <CountryMap
                countryData={countryData}
                selectedAdminLevel={selectedAdminLevel}
              />
            </div>
            <div className={`${activeViz === 'list' ? '' : 'hide'}`}>
              <LollipopChartViz
                data={countrySubnational.filter(
                  d => d.adminLevel === selectedAdminLevel,
                )}
                sortedBy={sortedBy}
              />
            </div>
            <div className={`${activeViz === 'scatterplot' ? '' : 'hide'}`}>
              <ScatterPlotSubnational
                data={countrySubnational.filter(
                  d => d.adminLevel === selectedAdminLevel,
                )}
                id='subnatScatterPlot'
              />
            </div>
          </div>
          <div className='chart-explanation'>
            <div className='stat-card'>
              <h3>{total?.mpi}</h3>
              <h4>National MPI {selectedCountry}</h4>
              <p className='margin-bottom-01'>
                Headcount Ratio: {total?.headcountRatio}%
              </p>
              <p>Intensity: {total?.intensity}%</p>
            </div>
            <div className='margin-top-05'>
              <div className='chart-container flex-chart'>
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
              </div>
            </div>
          </div>
        </div>
      ) : null}
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
      {indicatorFiles !== undefined && indicatorFiles.length > 0 ? (
        <div>
          <h4 className='undp-typography margin-top-09'>
            Multidimensional poverty indicators
          </h4>
          <p className='undp-typography margin-top-06'>
            The indicators used to measure multidimensional poverty can differ
            based on the particular context and goals of the assessment.
            Together, these indicators offer a more comprehensive perspective on
            people&apos;s overall well-being and enable the identification of
            the interrelated factors that underlie their multidimensional
            poverty. Consequently, they serve as valuable tools for policymakers
            and researchers seeking to develop a deeper and more nuanced
            comprehension of multidimensional poverty, as well as to devise
            precise strategies for its alleviation.
          </p>
          {indicatorFiles.map((d: any, i: Key | null | undefined) => (
            <div key={i}>
              <ListView indicatorFileName={d} />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
