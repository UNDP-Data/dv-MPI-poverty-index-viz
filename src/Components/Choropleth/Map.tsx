/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { scaleThreshold, scaleOrdinal } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import world from '../../Data/worldMap.json';
import { Tooltip } from '../Tooltip';
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
  background-color: rgba(255, 255, 255, 0.5);
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

export function Map(props: Props) {
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
    .scale(300)
    .translate([svgWidth / 2 - 50, svgHeight / 2]);
  const colorScale = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(colors);
  const colorScalePeriod = scaleOrdinal<number, string>()
    .domain(valueArray)
    .range(colors);
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
    <>
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
                    ? prop === 'firstYearMeasured'
                      ? colorScalePeriod(Number((value as any)[0][prop]))
                      : Number((value as any)[0][prop]) === 0 ||
                        // eslint-disable-next-line no-restricted-globals
                        isNaN(Number((value as any)[0][prop]))
                      ? 'var(--gray-500)'
                      : colorScale(Number((value as any)[0][prop]))
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
                                  ? 'high-opa'
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
                                  ? 'high-opa'
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
          </g>
        </svg>
        <LegendEl>
          <h6 className='undp-typography margin-left-03 margin-bottom-00'>
            LEGEND
          </h6>
          <svg viewBox='0 0 380 70'>
            <g transform='translate(10,20)'>
              <text
                x={320}
                y={-10}
                fontSize='0.8rem'
                fill='#212121'
                textAnchor='end'
              >
                {prop === 'mpi' ? 'Higher poverty' : ''}
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
                    fill={
                      prop === 'mpi'
                        ? colorScale(valueArray[i] - 0.00001)
                        : colorScalePeriod(valueArray[i])
                    }
                    stroke='#fff'
                  />
                  <text
                    x={
                      prop === 'mpi'
                        ? (320 * (i + 1)) / valueArray.length
                        : (320 * (i + 1)) / valueArray.length - 80
                    }
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
            </g>
          </svg>
        </LegendEl>
      </div>
      {hoverData ? <Tooltip data={hoverData} prop={prop} /> : null}
    </>
  );
}
