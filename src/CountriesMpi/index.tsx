/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented, Select, Radio, RadioChangeEvent } from 'antd';
import { Key, useEffect, useState, useRef } from 'react';
import { ascending } from 'd3-array';
import { scaleThreshold } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import {
  MpiDataTypeNational,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
  MpiDataTypeNationalYears,
} from '../Types';
import { Map } from '../Components/Choropleth/Map';
import { ScatterPlot } from './ScatterPlot';
import { CountryMap } from './CountryMap';
import { ScatterPlotSubnational } from './ScatterPlotSubnational';
import { LollipopChartViz } from './LollipopChartViz';
import { ListView } from './ListView';
import { BarChart } from './BarChart';

interface Props {
  national: MpiDataTypeNational[];
  nationalYears: MpiDataTypeNationalYears[];
  subnational: MpiDataTypeSubnational[];
  location: MpiDataTypeLocation[];
}

export function CountriesMpi(props: Props) {
  const { national, nationalYears, subnational, location } = props;
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
  const containerSubnat = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [subnatWidth, setSubnatWidth] = useState<number | 1000>(1000);
  national.sort((a, b) => ascending(a.country, b.country));
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const countryList = [
    ...new Set(
      nationalYears.map((d: MpiDataTypeNationalYears) => d.country.trim()),
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
    const totalValues = nationalYears?.filter(
      k => k.country === selectedCountry,
    )[0].countryData[0];
    setTotal(totalValues);
    setYear(totalValues.year);
    const subNatValues = subnational?.filter(
      k => k.country === selectedCountry,
    );
    setCountrySubnational(subNatValues);
    /// filtering most recent national data
    const countryDataValues = nationalYears.filter(
      (d: MpiDataTypeNationalYears) => d.country === selectedCountry,
    )[0].countryData[0];

    setCountryData(countryDataValues);
    const displayMap = countryDataValues?.displayMap;
    if (!displayMap) setActiveViz('scatterplot');
    else setActiveViz('map');

    setIndicatorFiles(countryDataValues.indicatorFiles);
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
  useEffect(() => {
    if (containerRef.current) {
      if (containerRef.current.clientWidth > 1800) setSubnatWidth(1200);
      else if (containerRef.current.clientWidth > 1200) setSubnatWidth(760);
      else setSubnatWidth(containerRef.current.clientWidth);
    }
  }, [containerRef.current]);
  return (
    <div ref={containerRef}>
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
      >
        <h3 className='undp-typography margin-bottom-07'>
          National Multidimensional Poverty Index (MPI) {queryCountry || ''}
        </h3>
        <p className='undp-typography'>
          A national Multidimensional Poverty Index (MPI) is a poverty measure
          tailored to specific countries, considering their unique
          circumstances. These measures typically emphasize important factors
          such as healthcare, education, and living conditions, while also
          incorporating other relevant dimensions using appropriate local
          indicators.
        </p>
      </div>
      {nationalYears ? (
        <>
          <h6 className='margin-top-10 undp-typography'>
            Change in National MPI
          </h6>
          <div className='flex-div flex-wrap gap-07'>
            <Map
              data={nationalYears}
              prop='percentChange'
              valueArray={[-40, -30, -20, -10, 0, 10, 20, 30, 40, 50]}
              colors={UNDPColorModule.divergentColors.colorsx10}
            />
            <div className='chart-explanation'>
              <div>
                <i>
                  Temporary text: This map shows the change in MPI through
                  years, a negative value means that there has been poverty
                  reduction (the darker the blue, the better). We have
                  considered that in most cases the methodology for calculating
                  remained the same through the years.
                </i>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {countryData?.note !== '' ? (
        <p>
          Note: <strong>{countryData?.note}</strong>
        </p>
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
      <div className='flex-div flex-wrap'>
        {countrySubnational && countrySubnational.length > 0 ? (
          <div
            className='chart-container'
            style={{ maxHeight: '750px', width: `${subnatWidth}px` }}
          >
            <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
              <div>
                <h6 className='undp-typography margin-bottom-01'>
                  Subnational MPI Data
                </h6>
                <p className='undp-typography small-font'>
                  Year: {countrySubnational[0].year}
                </p>
              </div>
              <div>
                <Segmented
                  style={{ backgroundColor: '#FFF', padding: '1px' }}
                  className='undp-segmented'
                  value={activeViz}
                  options={[
                    {
                      label: 'Map',
                      value: 'map',
                      disabled: !countryData?.displayMap,
                    },
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
                        Higher Poverty
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
            <div ref={containerSubnat}>
              <div className={activeViz === 'map' ? '' : 'hide'}>
                <CountryMap
                  countryData={
                    nationalYears?.filter(k => k.country === selectedCountry)[0]
                  }
                  selectedAdminLevel={selectedAdminLevel}
                  mapWidth={subnatWidth - 64}
                  mapHeight={500}
                />
              </div>
              <div className={`${activeViz === 'scatterplot' ? '' : 'hide'}`}>
                <ScatterPlotSubnational
                  data={countrySubnational.filter(
                    d => d.adminLevel === selectedAdminLevel,
                  )}
                  id='subnatScatterPlot'
                  activeViz={activeViz}
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
            </div>
            <p className='source margin-top-04'>
              Source:{' '}
              <a
                className='undp-style small-font'
                href={countryData?.reportUrl}
                target='_blank'
                rel='noreferrer'
              >
                {countryData?.reportName}
              </a>
            </p>
          </div>
        ) : null}
        <div className='chart-explanation flex-div flex-wrap'>
          <div
            className='stat-card'
            style={{ minWidth: '400px', maxHeight: '250px' }}
          >
            <h3>{total?.mpi}</h3>
            <h4>
              National MPI {selectedCountry} ({total?.year})
            </h4>
            <p className='margin-bottom-01'>
              Headcount Ratio: {total?.headcountRatio}%
            </p>
            <p>Intensity: {total?.intensity}%</p>
          </div>
          {urban || rural ? (
            <div
              className='chart-container flex-chart'
              style={{ maxHeight: '478px' }}
            >
              <div className='flex-div flex-space-between'>
                <div className='chart-top'>
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
              <div>
                <p className='source margin-top-00'>
                  Source:{' '}
                  <a
                    className='undp-style small-font'
                    href={countryData?.reportUrl}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {countryData?.reportName}
                  </a>
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {nationalYears?.filter(k => k.country === selectedCountry)[0].countryData
        .length > 1 ? (
        <div style={{ maxWidth: '1024px', margin: '0 auto 5rem auto' }}>
          <h4 className='undp-typography margin-top-09'>
            Evolution of MPI through the years in {countryData?.country}
          </h4>
          <div
            className='flex-div flex-wrap gap-07 margin-top-07'
            style={{ height: '500px' }}
          >
            <div className='chart-container'>
              <h6 className='undp-typography margin-bottom-01'>
                Change in time
              </h6>
              <BarChart
                data={
                  nationalYears?.filter(k => k.country === selectedCountry)[0]
                    .countryData
                }
                indicator={
                  nationalYears?.filter(k => k.country === selectedCountry)[0]
                    .indicatorChange
                }
              />
            </div>
            <div>
              <h5>Sources</h5>
              {nationalYears
                ?.filter(k => k.country === selectedCountry)[0]
                .countryData.map((d, i) => (
                  <div key={i}>
                    <a
                      className='undp-style small-font'
                      href={d.reportUrl}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {d.reportName}
                    </a>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ) : null}
      {indicatorFiles !== undefined && indicatorFiles.length > 0 ? (
        <div>
          <div
            style={{
              maxWidth: '1024px',
              margin: '0 auto',
              padding: '0 1.5rem',
            }}
          >
            <h4 className='undp-typography margin-top-09'>
              Multidimensional poverty indicators for {countryData?.country}
            </h4>
            <p className='undp-typography margin-top-06'>
              The indicators used to measure multidimensional poverty can differ
              based on the particular context and goals of the assessment.
              Together, these indicators offer a more comprehensive perspective
              on people&apos;s overall well-being and enable the identification
              of the interrelated factors that underlie their multidimensional
              poverty. Consequently, they serve as valuable tools for
              policymakers and researchers seeking to develop a deeper and more
              nuanced comprehension of multidimensional poverty, as well as to
              precise strategies for its alleviation.
            </p>
            <p className='undp-typography small-font'>
              For a definition of the indicators see{' '}
              <a
                className='undp-style small-font'
                href={countryData?.reportUrl}
                target='_blank'
                rel='noreferrer'
              >
                {countryData?.reportName}
              </a>{' '}
              (Page {countryData?.page} {countryData?.placement})
            </p>
          </div>
          <h6 className='undp-typography margin-top-09'>
            Percentage of households experiencing deprivations in the listed
            indicators
          </h6>
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
