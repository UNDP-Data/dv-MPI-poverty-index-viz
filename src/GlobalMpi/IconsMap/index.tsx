/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { scaleThreshold, scaleLinear } from 'd3-scale';
import { select } from 'd3-selection';
import { min, extent } from 'd3-array';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import world from '../../Data/worldMap.json';
import { Tooltip } from './Tooltip';
import { HoverDataType } from '../../Types';

interface Props {
  data: object[];
  prop: string;
  valueArray: any[];
  colors: string[];
}

const LegendEl = styled.div`
  position: relative;
  right: 10px;
  padding: 0.5rem 0.5rem 0 0.5rem;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: var(--shadow);
  width: 360px;
  margin-left: 1rem;
  margin-top: -1rem;
  z-index: 5;
  @media (min-width: 961px) {
    position: absolute;
    transform: translateY(-100%);
  }
`;

export function IconsMap(props: Props) {
  const { data, prop, valueArray, colors } = props;
  const svgWidth = 1280;
  const svgHeight = 750;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const [selectedColor, setSelectedColor] = useState<string | undefined>(
    undefined,
  );
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    undefined,
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(290)
    .translate([svgWidth / 2 - 50, svgHeight / 2 + 10]);
  const colorScale = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(colors);
  const minValue = min(data, (d: any) => d.annualizedChangeHeadcount);
  const extentValue = extent(data, (d: any) => d.annualizedChangeHeadcount);
  const valueScale = scaleLinear<number>().domain([minValue, 0]).range([30, 0]);
  useEffect(() => {
    const mapGSelect = select(mapG.current);
    const mapSvgSelect = select(mapSvg.current);
    const zoomBehaviour = zoom()
      .scaleExtent([1, 6])
      .translateExtent([
        [-20, 0],
        [svgWidth + 20, svgHeight],
      ])
      .on('zoom', ({ transform }) => {
        setZoomLevel(transform.k);
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, []);
  return (
    <div className='chart-global-container'>
      <div className='map-container'>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} ref={mapSvg}>
          <g ref={mapG}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              world.features.map((d: any, i: number) => {
                const value = data.filter(k => {
                  return (k as any).iso_a3 === d.properties.ISO3;
                });
                const color =
                  value.length > 0
                    ? colorScale((value as any)[0][prop] - 0.00001)
                    : 'var(--gray-300)';
                if (
                  d.properties.NAME === '' ||
                  d.properties.NAME === 'Antarctica'
                )
                  return null;
                return (
                  <g
                    key={i}
                    onMouseEnter={event => {
                      setSelectedCountry(d.properties.ISO3);
                      if (value[0] !== undefined) {
                        setHoverData({
                          country: (value[0] as any).country,
                          continent: (value[0] as any).region,
                          countryValues: value[0],
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      } else {
                        setHoverData({
                          country: d.properties.NAME,
                          continent: d.properties.REGION,
                          countryValues: {},
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setSelectedCountry(undefined);
                      setHoverData(undefined);
                    }}
                  >
                    {d.geometry.type === 'MultiPolygon'
                      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        d.geometry.coordinates.map((el: any, j: any) => {
                          let masterPath = '';
                          el.forEach((geo: number[][]) => {
                            let path = ' M';
                            geo.forEach((c: number[], k: number) => {
                              const point = projection([c[0], c[1]]) as [
                                number,
                                number,
                              ];
                              if (k !== geo.length - 1)
                                path = `${path}${point[0]} ${point[1]}L`;
                              else path = `${path}${point[0]} ${point[1]}`;
                            });
                            masterPath += path;
                          });
                          return (
                            <path
                              className={
                                selectedCountry === d.properties.ISO3
                                  ? value.length > 0
                                    ? 'high-opa'
                                    : 'high-opa-grey'
                                  : ''
                              }
                              key={j}
                              d={masterPath}
                              stroke='#ccc'
                              strokeWidth={1 / zoomLevel}
                              fill={color}
                              opacity={
                                !selectedColor || selectedColor === color
                                  ? 1
                                  : 0.3
                              }
                            />
                          );
                        })
                      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        d.geometry.coordinates.map((el: any, j: number) => {
                          let path = 'M';
                          el.forEach((c: number[], k: number) => {
                            const point = projection([c[0], c[1]]) as [
                              number,
                              number,
                            ];
                            if (k !== el.length - 1)
                              path = `${path}${point[0]} ${point[1]}L`;
                            else path = `${path}${point[0]} ${point[1]}`;
                          });
                          return (
                            <path
                              className={
                                selectedCountry === d.properties.ISO3
                                  ? value.length > 0
                                    ? 'high-opa'
                                    : 'high-opa-grey'
                                  : ''
                              }
                              key={j}
                              d={path}
                              stroke='#ccc'
                              strokeWidth={1 / zoomLevel}
                              fill={color}
                              opacity={
                                !selectedColor || selectedColor === color
                                  ? 1
                                  : 0.3
                              }
                            />
                          );
                        })}
                  </g>
                );
              })
            }
            <g>
              {data.map((d: any, i: number) => {
                const { properties } = world.features.filter(
                  k => k.properties.ISO3 === d.iso_a3,
                )[0];
                const point = projection([properties.LON, properties.LAT] as [
                  number,
                  number,
                ]);
                if (point !== null)
                  return (
                    <g
                      key={i}
                      transform={`translate(${point[0]}, ${point[1]})`}
                      onMouseEnter={event => {
                        setSelectedCountry(d.iso_a3);
                        setHoverData({
                          country: (d as any).country,
                          continent: (d as any).region,
                          countryValues: d,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      }}
                      onMouseLeave={() => {
                        setSelectedCountry(undefined);
                        setHoverData(undefined);
                      }}
                    >
                      <g
                        transform={`translate(0,${
                          -valueScale(d.annualizedChangeHeadcount) /
                          2 /
                          zoomLevel
                        })`}
                      >
                        <polygon
                          transform={`rotate(${
                            d.annualizedChangeHeadcount > 0 ? 180 : 0
                          })`}
                          points={`${-3 / zoomLevel}, 0, ${-3 / zoomLevel}, ${
                            valueScale(-Math.abs(d.annualizedChangeHeadcount)) /
                            zoomLevel
                          }, ${-6 / zoomLevel}, ${
                            valueScale(-Math.abs(d.annualizedChangeHeadcount)) /
                            zoomLevel
                          }, 0, ${
                            (valueScale(
                              -Math.abs(d.annualizedChangeHeadcount),
                            ) +
                              7) /
                            zoomLevel
                          }, ${6 / zoomLevel}, ${
                            valueScale(-Math.abs(d.annualizedChangeHeadcount)) /
                            zoomLevel
                          }, ${3 / zoomLevel}, ${
                            valueScale(-Math.abs(d.annualizedChangeHeadcount)) /
                            zoomLevel
                          }, ${3 / zoomLevel}, 0`}
                          fill={
                            selectedCountry === d.iso_a3 ? '#000' : '#f5f5f5'
                          }
                          strokeWidth={1 / zoomLevel}
                          stroke={
                            selectedCountry === d.iso_a3 ? '#f5f5f5' : '#000'
                          }
                        />
                      </g>
                    </g>
                  );
                return null;
              })}
            </g>
          </g>
        </svg>
        <LegendEl>
          <h6 className='undp-typography'>LEGEND</h6>
          <p className='legend-title margin-bottom-00'>
            Multidimensional poverty index
          </p>
          <svg viewBox='0 0 380 60'>
            <g transform='translate(10,20)'>
              <text
                x={320}
                y={-10}
                fontSize='0.8rem'
                fill='#212121'
                textAnchor='end'
              >
                {prop === 'mpi' ? 'Higher poverty' : 'Increase in poverty'}
              </text>
              {valueArray.map((d, i) => (
                <g key={i}>
                  <rect
                    onMouseOver={() =>
                      setSelectedColor(colorScale(valueArray[i] - 0.00001))
                    }
                    onMouseLeave={() => setSelectedColor(undefined)}
                    x={(i * 320) / valueArray.length}
                    y={1}
                    width={320 / valueArray.length}
                    height={8}
                    fill={colorScale(valueArray[i] - 0.00001)}
                    stroke='#fff'
                  />
                  <text
                    x={(320 * (i + 1)) / valueArray.length}
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
                {prop === 'mpi' ? '0' : ''}
              </text>
              {prop !== 'mpi' ? (
                <>
                  <text
                    y={42}
                    x={320 / valueArray.length + 10}
                    fontSize={12}
                    fill='#212121'
                  >
                    Countries with measurements for only one year
                  </text>
                  <rect
                    x={0}
                    y={35}
                    width={320 / valueArray.length}
                    height={8}
                    fill='var(--gray-500)'
                    stroke='#fff'
                  />
                </>
              ) : null}
            </g>
          </svg>
          <div>
            <p className='legend-title margin-bottom-02'>
              Annualized Change Incidence
            </p>
            <svg viewBox='0 0 380 70'>
              <g transform='translate(0,0)'>
                <g transform='translate(10,40)'>
                  <text className='label' y='-25' x='-10'>
                    Increase
                  </text>
                  <polygon
                    transform='rotate(180)'
                    points={`-3, 0, -3, 
                    ${valueScale(-extentValue[1])}, -6, 
                    ${valueScale(-extentValue[1])}, 0,
                    ${valueScale(-extentValue[1]) + 7}, 6, ${valueScale(
                      -extentValue[1],
                    )}, 3, ${valueScale(-extentValue[1])}, 3, 0`}
                    fill='#f5f5f5'
                    strokeWidth='1'
                    stroke='#000'
                  />
                  <text x='20' y='0' className='label'>
                    {extentValue[1].toFixed(2)}
                  </text>
                </g>
                <g transform='translate(100,40)'>
                  <text className='label' y='-25' x='-10'>
                    Decrease
                  </text>
                  <polygon
                    transform='translate(0,-10)'
                    points={`-3, 0, -3, 
                    ${valueScale(extentValue[0])}, -6, 
                    ${valueScale(extentValue[0])}, 0,
                    ${valueScale(extentValue[0]) + 7}, 6, ${valueScale(
                      extentValue[0],
                    )}, 3, ${valueScale(extentValue[0])}, 3, 0`}
                    fill='#f5f5f5'
                    strokeWidth='1'
                    stroke='#000'
                  />
                  <text x='20' y='0' className='label'>
                    {extentValue[0].toFixed(2)}
                  </text>
                </g>
              </g>
            </svg>
          </div>
        </LegendEl>
      </div>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </div>
  );
}
