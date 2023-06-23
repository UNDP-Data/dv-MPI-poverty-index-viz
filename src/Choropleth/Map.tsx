/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { useEffect, useRef, useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import styled from 'styled-components';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { min, max } from 'd3-array';
import { zoom } from 'd3-zoom';
import { rewind } from '@turf/turf';
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
  const svgWidth = 1000;
  const svgHeight = 470;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const valueArray = [
    0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55,
  ];
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(180)
    .rotate([-10, 0])
    .translate([svgWidth / 2, svgHeight / 2]);
  const colorScale = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx10);
  const worldFeatures = world.features || [];
  useEffect(() => {
    worldFeatures.forEach(d => {
      // eslint-disable-next-line no-param-reassign
      d.geometry = rewind(d.geometry, { reverse: true });
    });
    const minMpi = min(data, (d: { mpi: number }) => d.mpi);
    const maxMpi = max(data, (d: { mpi: number }) => d.mpi);
    // eslint-disable-next-line no-console
    console.log('minMpi', minMpi, 'maxMpi', maxMpi);
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
    <div
      className='mapContainer'
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
            worldFeatures.map((d: any, i: number) => {
              const value = data.filter(k => {
                return k.iso_a3 === d.properties.ISO3;
              });
              const color =
                value.length > 0 ? colorScale(Number(value[0].mpi)) : 'none';
              const path = geoPath().projection(projection);
              // eslint-disable-next-line no-console
              // console.log('name', i, d.properties.NAME);
              if (d.properties.NAME === '') return null;
              return (
                <g key={i}>
                  <path
                    d={path(d) || ''}
                    className={d.properties.ISO3}
                    stroke='#f3f3f3'
                    strokeWidth={1 / zoomLevel}
                    fill={color}
                    onMouseEnter={event => {
                      if (value.length > 0) {
                        setHoverData({
                          country: value[0].country,
                          continent: value[0].region,
                          value: Number(value[0].mpi),
                          year: Number(value[0].year),
                          xPosition: event.clientX,
                          yPosition: event.clientY,
                        });
                      }
                    }}
                    onMouseLeave={() => {
                      setHoverData(undefined);
                    }}
                  />
                </g>
              );
            })
          }
        </g>
      </svg>
      <LegendEl>
        <h6 className='undp-typography'>Legend</h6>
        <svg width='100%' viewBox={`0 0 ${400} ${30}`}>
          <g>
            {valueArray.map((d, i) => (
              <g key={i}>
                <rect
                  x={(i * 320) / 11}
                  y={1}
                  width={320 / 9}
                  height={8}
                  fill={UNDPColorModule.sequentialColors.negativeColorsx10[i]}
                />
                <text x={(i * 320) / 10} y={25} fontSize={12} fill='#212121'>
                  {d}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </LegendEl>
      {hoverData ? <Tooltip data={hoverData} /> : null}
    </div>
  );
}
