/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import { Radio, RadioChangeEvent } from 'antd';
import world from '../Data/worldMap.json';
import { Tooltip } from '../Components/Tooltip';
import { MpiDataType, HoverDataType } from '../Types';

interface Props {
  data: MpiDataType[];
}

const LegendEl = styled.div`
  position: absolute;
  right: 10px;
  padding: 0.5rem 0.5rem 0 0.5rem;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow);
  width: 440px;
  margin-left: 1rem;
  margin-top: -1rem;
  z-index: 5;
  @media (min-width: 961px) {
    transform: translateY(-100%);
  }
`;

export function Map(props: Props) {
  const { data } = props;
  const svgWidth = 1280;
  const svgHeight = 600;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [radioValue, setRadioValue] = useState('mpi');
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const percentArray = [10, 20, 30, 40, 50, 60, 70, 80, 90];
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(230)
    // .rotate([-10, 0])
    .translate([svgWidth / 2, svgHeight / 2]);
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx08);
  const colorScaleHeadcount = scaleThreshold<number, string>()
    .domain(percentArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx10);
  const onChange = (e: RadioChangeEvent) => {
    setRadioValue(e.target.value);
  };
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
    <div>
      <Radio.Group
        defaultValue='mpi'
        onChange={onChange}
        className='margin-bottom-05'
      >
        <Radio className='undp-radio' value='mpi'>
          MPI
        </Radio>
        <Radio className='undp-radio' value='percent'>
          Population in multidimensional poverty
        </Radio>
      </Radio.Group>
      <div
        className='map-container'
        style={{
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
        }}
      >
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          ref={mapSvg}
        >
          <g ref={mapG}>
            {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              world.features.map((d: any, i: number) => {
                const value = data.filter(k => {
                  return k.iso_a3 === d.properties.ISO3;
                });
                const color =
                  value.length > 0
                    ? radioValue === 'mpi'
                      ? colorScaleMPI(Number(value[0].mpi))
                      : colorScaleHeadcount(Number(value[0].headcountRatio))
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
                      if (value.length > 0) {
                        setHoverData({
                          country: value[0].country,
                          continent: value[0].region,
                          value: Number(value[0].mpi),
                          year: Number(value[0].year),
                          headcountRatio: Number(value[0].headcountRatio),
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      } else {
                        setHoverData({
                          country: d.properties.NAME,
                          continent: d.properties.REGION,
                          value: 0,
                          year: 0,
                          headcountRatio: 0,
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => {
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
                              key={j}
                              d={masterPath}
                              stroke='#FFF'
                              strokeWidth={1 / zoomLevel}
                              fill={color}
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
                              key={j}
                              d={path}
                              stroke='#FFF'
                              strokeWidth={1 / zoomLevel}
                              fill={color}
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
          <h6 className='undp-typography'>Legend</h6>
          <svg width='100%' viewBox='0 0 400 50'>
            <text
              x={300}
              y={10}
              fontSize='0.8rem'
              fill='#212121'
              textAnchor='end'
            >
              Higher poverty
            </text>
            <g transform='translate(10,20)'>
              {valueArray.map((d, i) => (
                <g key={i}>
                  <rect
                    x={(i * 320) / 8}
                    y={1}
                    width={320 / 8}
                    height={8}
                    fill={colorScaleMPI(valueArray[i] - 0.05)}
                    stroke='#fff'
                  />
                  <text
                    x={(320 * (i + 1)) / 8}
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
        </LegendEl>
      </div>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </div>
  );
}
