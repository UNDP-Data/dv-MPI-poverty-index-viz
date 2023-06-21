/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useRef } from 'react';
import { scaleThreshold } from 'd3-scale';
import { select } from 'd3-selection';
import { geoEqualEarth, geoPath } from 'd3-geo';
import { min, max } from 'd3-array';
import { zoom } from 'd3-zoom';
import { rewind } from '@turf/turf';
import world from '../Data/worldMap.json';
import { REDCOLORSCALE } from '../Constants';
// import { Tooltip } from '../Components/Tooltip';
import { MpiDataType, WorldFeatures } from '../Types';

interface Props {
  data: MpiDataType[];
}

export function Map(props: Props) {
  const { data } = props;
  const svgWidth = 1280;
  const svgHeight = 678;
  const mapSvg = useRef<SVGSVGElement>(null);
  const mapG = useRef<SVGGElement>(null);
  /* const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  ); */
  const projection = geoEqualEarth()
    .rotate([0, 0])
    .scale(180)
    .translate([470, 315]);
  const colorScale = scaleThreshold<number, string>()
    .domain([
      0, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.7,
    ])
    .range(REDCOLORSCALE);
  const worldFeatures = world.features || [];
  worldFeatures.forEach(d => {
    // eslint-disable-next-line no-param-reassign
    d.geometry = rewind(d.geometry, { reverse: true });
  });
  const minMpi = min(data, (d: { mpi: number }) => d.mpi);
  const maxMpi = max(data, (d: { mpi: number }) => d.mpi);
  // eslint-disable-next-line no-console
  console.log('minMpi', minMpi, 'maxMpi', maxMpi);
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
        mapGSelect.attr('transform', transform);
      });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mapSvgSelect.call(zoomBehaviour as any);
  }, []);
  return (
    <div>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        ref={mapSvg}
      >
        <g ref={mapG}>
          {worldFeatures.map((d: WorldFeatures, i: number) => {
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
                  d={path(d)}
                  className={d.properties.ISO3}
                  stroke='#f3f3f3'
                  fill={color}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
