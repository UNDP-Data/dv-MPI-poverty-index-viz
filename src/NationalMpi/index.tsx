/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Segmented, Select, Radio, RadioChangeEvent } from 'antd';
import { Key, useEffect, useState, useRef } from 'react';
import { ascending, extent } from 'd3-array';
import { scaleQuantize } from 'd3-scale';
import UNDPColorModule from 'undp-viz-colors';
import {
  MpiDataTypeNational,
  MpiDataTypeSubnational,
  MpiDataTypeLocation,
  MpiDataTypeNationalYears,
} from '../Types';
import ImageDownloadButton from '../Components/ImageDownloadButton';
import { ScatterPlot } from './ScatterPlot';
import { CountryMap } from './CountryMap';
import { ScatterPlotSubnational } from './ScatterPlotSubnational';
import { LollipopChartViz } from './LollipopChartViz';
import { ListView } from './ListView';
import { BarChart } from './BarChart';
import { ChoroplethNational } from './ChoroplethNational';

interface Props {
  national: MpiDataTypeNational[];
  nationalYears: MpiDataTypeNationalYears[];
  subnational: MpiDataTypeSubnational[];
  location: MpiDataTypeLocation[];
}

export function NationalMpi(props: Props) {
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
  const [subnatExtent, setSubnatExtent] = useState<[number, number]>([0, 1]);
  const [activeViz, setActiveViz] = useState<string>('map');
  const [boundValues, setBoundValues] = useState<number[]>([]);
  const colorScaleMPI = scaleQuantize<string, number>()
    // .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx05);
  const [sortedBy, setSortedBy] = useState('mpi');
  const containerSubnat = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [subnatWidth, setSubnatWidth] = useState<number>(0);
  national.sort((a, b) => ascending(a.country, b.country));
  const queryParams = new URLSearchParams(window.location.search);
  const queryCountry = queryParams.get('country');
  const countryList = [
    ...new Set(
      nationalYears.map((d: MpiDataTypeNationalYears) => d.country.trim()),
    ),
  ].sort();
  const defaultCountry = queryCountry || 'Afghanistan';
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
      ].length > 0
    ) {
      setSelectedAdminLevel(
        [
          ...new Set(
            subNatValues.map((d: MpiDataTypeSubnational) => d.adminLevel),
          ),
        ][0],
      );
    }
    const extentArray = extent(
      subNatValues as MpiDataTypeSubnational[],
      (d: any) => Number(d.mpi),
    );
    setSubnatExtent(
      subNatValues.length > 0 ? (extentArray as [number, number]) : [0, 1],
    );
  }, [selectedCountry]);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSubnatWidth(entries[0].target.clientWidth);
    });
    if (containerSubnat.current)
      resizeObserver.observe(containerSubnat.current);
    return () => resizeObserver.disconnect();
  }, [containerSubnat.current]);
  useEffect(() => {
    colorScaleMPI.domain(subnatExtent as [number, number]);
    const bounds: number[] = [];
    UNDPColorModule.sequentialColors.negativeColorsx05.forEach(color => {
      bounds.push(colorScaleMPI.invertExtent(color)[1]);
    });
    setBoundValues(bounds);
  }, [subnatExtent]);
  return (
    <div>
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
      >
        <h2 className='undp-typography margin-bottom-08'>
          National Multidimensional Poverty Index (MPI) {queryCountry || ''}
        </h2>
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
        <div
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '0 1.5rem',
          }}
        >
          <div className='chart-national-container'>
            <ChoroplethNational data={nationalYears} />
          </div>
          <div className='chart-explanation-national'>
            <div>
              <p className='undp-typography margin-top-06 margin-bottom-09'>
                Over the past 15 years, more than 35 countries around the world
                have developed national MPIs (N-MPIs). This reflects an
                increased recognition of the importance of complementing
                monetary measures with estimates of other dimensions of poverty
                for more effective policy-making. Over the past four years
                alone, in the wake of COVID-19 pandemic, 16 more countries have
                adopted national MPIs.
              </p>
            </div>
          </div>
        </div>
      ) : null}
      <hr className='undp-style light margin-bottom-06' />
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
        className='margin-bottom-07'
      >
        <h3 className='undp-typography margin-bottom-08 margin-top-08'>
          Leaving No One Behind
        </h3>
        <p className='undp-typography'>
          In line with the central promise of the 2030 Agenda to leave no one
          behind, efforts have been made to spotlight disparities in the way
          people experience multidimensional poverty by disaggregating MPI data
          by age, gender, rural/urban areas, subnational regions and other
          parameters.
        </p>
      </div>
      {!queryCountry ? (
        <div
          className='margin-bottom-08'
          style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
        >
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
      {countryData?.note !== '' ? (
        <div
          className='margin-bottom-08'
          style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
        >
          <p className='undp-typography'>
            Note: <strong>{countryData?.note}</strong>
          </p>
        </div>
      ) : null}
      {urban ||
      rural ||
      (countrySubnational && countrySubnational.length > 0) ? (
        <div
          className='flex-div flex-wrap'
          ref={containerRef}
          style={{ margin: '0 auto', maxWidth: '1600px' }}
          id='ruralUrbanNational'
        >
          <div className='national-stats-area flex-div flex-wrap gap-05'>
            <div className='stat-card'>
              <h3>
                {Number(total?.mpi) ? Number(total?.mpi).toFixed(3) : 'N/A'}
              </h3>
              <h4>
                National MPI {selectedCountry} ({total?.year})
              </h4>
              <p className='margin-bottom-01'>
                Incidence: {total?.headcountRatio}%
              </p>
              <p>
                Intensity:{' '}
                {Number(total?.intensity)
                  ? `${Number(total?.intensity)}%`
                  : 'N/A'}
              </p>
            </div>
            {urban || rural ? (
              <div className='chart-container flex-chart flex-column flex-div flex-space-between'>
                <div id='urbanRuralNational'>
                  <div className='flex-div flex-space-between'>
                    <div className='chart-top'>
                      <h6 className='undp-typography margin-bottom-01'>
                        Rural and Urban MPI
                      </h6>
                      <p className='undp-typography small-font'>Year: {year}</p>
                    </div>
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
                  <ScatterPlot
                    urban={urban}
                    rural={rural}
                    total={total}
                    id='locationScatterPlot'
                    country={selectedCountry}
                  />
                </div>
                <div className='flex-div flex-space-between flex-wrap margin-top-02'>
                  <div style={{ flexBasis: '50%', flexGrow: '1' }}>
                    <p className='source margin-top-00 undp-typography'>
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
                  <div className='margin-top-00'>
                    <ImageDownloadButton
                      nodeID='urbanRuralNational'
                      buttonText='Download graph'
                      filename='urbanRuralNational'
                      buttonType='secondary'
                    />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
          {countrySubnational && countrySubnational.length > 0 ? (
            <div className='chart-container-subnational'>
              <div className='flex-div flex-space-between flex-wrap margin-bottom-03'>
                <div>
                  <h6 className='undp-typography margin-bottom-01'>
                    Subnational Multidimensional Poverty
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
                        label: 'Intensity vs Incidence',
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
                    <svg width='310px' height='50px'>
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
                        {UNDPColorModule.sequentialColors.negativeColorsx05.map(
                          (d, i) => (
                            <g key={i}>
                              <rect
                                x={(i * 280) / 5}
                                y={1}
                                width={280 / 5}
                                height={8}
                                fill={d}
                                stroke='#fff'
                              />
                              <text
                                x={(280 * (i + 1)) / 5}
                                y={25}
                                fontSize={12}
                                fill='#212121'
                                textAnchor='middle'
                              >
                                {boundValues[i].toFixed(2)}
                              </text>
                            </g>
                          ),
                        )}
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
                        <Radio className='undp-radio' value='headcountRatio'>
                          Incidence
                        </Radio>
                        <Radio className='undp-radio' value='intensity'>
                          Intensity
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
                      nationalYears?.filter(
                        k => k.country === selectedCountry,
                      )[0]
                    }
                    subnationalMPIextent={subnatExtent}
                    selectedAdminLevel={selectedAdminLevel}
                    mapWidth={subnatWidth - 64}
                    mapHeight={500}
                  />
                  <div className='flex-div flex-space-between flex-wrap margin-top-04'>
                    <div style={{ flexBasis: '60%', flexGrow: '1' }}>
                      <p className='source margin-top-04 undp-typography'>
                        Source:{' '}
                        <a
                          className='undp-style small-font'
                          href={countryData?.reportUrl}
                          target='_blank'
                          rel='noreferrer'
                        >
                          {countryData?.reportName}
                        </a>
                        <br />
                        <br />
                        Note: The designations employed and the presentation of
                        material on this map do not imply the expression of any
                        opinion whatsoever on the part of the Secretariat of the
                        United Nations or UNDP concerning the legal status of
                        any country, territory, city or area or its authorities,
                        or concerning the delimitation of its frontiers or
                        boundaries.
                      </p>
                    </div>
                    <div className='margin-top-04' style={{ display: 'none' }}>
                      <ImageDownloadButton
                        nodeID='mapSubnational'
                        buttonText='Download map'
                        filename='mapSubnational'
                        buttonType='secondary'
                      />
                    </div>
                  </div>
                </div>
                <div className={`${activeViz === 'scatterplot' ? '' : 'hide'}`}>
                  <ScatterPlotSubnational
                    data={countrySubnational.filter(
                      d => d.adminLevel === selectedAdminLevel,
                    )}
                    id='subnatScatterPlot'
                    activeViz={activeViz}
                    subnationalMPIextent={subnatExtent}
                  />
                  <div className='flex-div flex-space-between flex-wrap margin-top-04'>
                    <div style={{ flexBasis: '60%', flexGrow: '1' }}>
                      <p className='source margin-top-04 undp-typography'>
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
                    <div className='margin-top-04'>
                      <ImageDownloadButton
                        nodeID='scatterplotSubnational'
                        buttonText='Download graph'
                        filename='scatterplotSubnational'
                        buttonType='secondary'
                      />
                    </div>
                  </div>
                </div>
                <div className={`${activeViz === 'list' ? '' : 'hide'}`}>
                  <LollipopChartViz
                    data={countrySubnational.filter(
                      d => d.adminLevel === selectedAdminLevel,
                    )}
                    sortedBy={sortedBy}
                  />
                  <div className='flex-div flex-space-between flex-wrap margin-top-04'>
                    <div style={{ flexBasis: '60%', flexGrow: '1' }}>
                      <p className='source margin-top-04 undp-typography'>
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
                    <div className='margin-top-04'>
                      <ImageDownloadButton
                        nodeID='listSubnational'
                        buttonText='Download graph'
                        filename='listSubnational'
                        buttonType='secondary'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div
          style={{
            maxWidth: '1024px',
            margin: '0 auto',
            padding: '0 1.5rem',
          }}
        >
          <div
            className='stat-card'
            style={{ minWidth: '300px', maxHeight: '250px' }}
          >
            <h3>
              {Number(total?.mpi) ? Number(total?.mpi).toFixed(3) : 'N/A'}
            </h3>
            <h4>
              National MPI {selectedCountry} ({total?.year})
            </h4>
            <p className='margin-bottom-01'>
              Incidence: {total?.headcountRatio}%
            </p>
            <p>
              Intensity:{' '}
              {Number(total?.intensity)
                ? `${Number(total?.intensity)}%`
                : 'N/A'}
            </p>
          </div>
        </div>
      )}
      {nationalYears?.filter(k => k.country === selectedCountry)[0].countryData
        .length > 1 ? (
        <div
          style={{
            maxWidth: '1024px',
            margin: '1.5rem auto',
            padding: '0 1.5rem',
          }}
        >
          <h3 className='undp-typography margin-top-10'>
            Evolution of MPI through the years in {countryData?.country}
          </h3>
          <div className='flex-div flex-wrap gap-07 margin-top-07'>
            <div className='chart-container'>
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
            <h3 className='undp-typography margin-top-09 margin-bottom-08'>
              Multidimensional poverty indicators for {countryData?.country}
            </h3>
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
