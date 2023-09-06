/* eslint-disable no-console */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth } from 'd3-geo';
import { zoom } from 'd3-zoom';
import world from '../../Data/worldMap.json';
import { Tooltip } from '../Tooltip';
import { MpiDataType, HoverDataType } from '../../Types';

interface Props {
  data: MpiDataType[];
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
  const { data } = props;
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
  const radioValue = 'mpi';
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const percentArray = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(300)
    .translate([svgWidth / 2 - 50, svgHeight / 2]);
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx07);
  const colorScaleHeadcount = scaleThreshold<number, string>()
    .domain(percentArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx10);
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
                      setSelectedCountry(d.properties.ISO3);
                      if (value.length > 0) {
                        setHoverData({
                          country: value[0].country,
                          continent: value[0].region,
                          value: Number(value[0].mpi),
                          year: value[0].year,
                          headcountRatio: Number(value[0].headcountRatio),
                          intensity: Number(value[0].intensity),
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      } else {
                        setHoverData({
                          country: d.properties.NAME,
                          continent: d.properties.REGION,
                          value: 0,
                          year: '',
                          headcountRatio: 0,
                          intensity: 0,
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
                              stroke='#FFF'
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
                              stroke='#FFF'
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
          <svg viewBox='0 0 340 50'>
            {radioValue === 'mpi' ? (
              <g transform='translate(10,20)'>
                <text
                  x={320}
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
                      onMouseOver={() =>
                        setSelectedColor(colorScaleMPI(valueArray[i] - 0.05))
                      }
                      onMouseLeave={() => setSelectedColor(undefined)}
                      x={(i * 320) / valueArray.length}
                      y={1}
                      width={320 / valueArray.length}
                      height={8}
                      fill={colorScaleMPI(valueArray[i] - 0.05)}
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
                  0
                </text>
              </g>
            ) : (
              <g transform='translate(10,20)'>
                <text
                  x={320}
                  y={-10}
                  fontSize='0.8rem'
                  fill='#212121'
                  textAnchor='end'
                >
                  Higher Headcount (%)
                </text>
                {percentArray.map((d, i) => (
                  <g key={i}>
                    <rect
                      x={(i * 320) / percentArray.length}
                      y={1}
                      width={320 / percentArray.length}
                      height={8}
                      fill={colorScaleHeadcount(percentArray[i] - 5)}
                      stroke='#fff'
                    />
                    <text
                      x={(320 * (i + 1)) / percentArray.length}
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
            )}
          </svg>
        </LegendEl>
      </div>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </div>
  );
}