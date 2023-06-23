import sortBy from 'lodash.sortby';
// import maxBy from 'lodash.maxby';
import UNDPColorModule from 'undp-viz-colors';
// eslint-disable-next-line import/no-extraneous-dependencies
import { scaleLinear } from 'd3-scale';
import { MpiDataTypeUrbanRural } from '../Types';

interface Props {
  data: MpiDataTypeUrbanRural[];
  sortedByKey: string;
}

export function DumbellChart(props: Props) {
  const { data, sortedByKey } = props;
  const graphWidth = 1280;
  const leftPadding = 230;
  const rightPadding = 200;
  const rowHeight = 35;
  const marginTop = 50;
  // const maxRural = maxBy(data, 'mpiRural');
  /* const maxDiff = maxBy(
    data,
    (d: { mpiUrban: number; mpiRural: number }) => d.mpiUrban - d.mpiRural,
  ); */
  const sortedData: MpiDataTypeUrbanRural[] = sortBy(data, sortedByKey);
  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();
  return (
    <div>
      <svg viewBox={`0 0 ${graphWidth} ${data.length * rowHeight + marginTop}`}>
        {sortedData.map((d, i) =>
          d ? (
            <g key={i} transform={`translate(0,${marginTop + i * rowHeight})`}>
              <text
                x={0}
                y={rowHeight / 2}
                dy='3px'
                fontSize='14px'
                color='#110848'
              >
                {d.country}
              </text>
              <line
                x1={leftPadding}
                x2={graphWidth - rightPadding}
                y1={rowHeight / 2}
                y2={rowHeight / 2}
                stroke='#AAA'
                strokeWidth={1}
                strokeDasharray='2 2'
                shapeRendering='crispEdge'
              />
              <line
                x1={xPos(d.mpiRural) + leftPadding}
                x2={xPos(d.mpiUrban) + leftPadding}
                y1={rowHeight / 2}
                y2={rowHeight / 2}
                stroke='#110848'
                strokeWidth={1}
                shapeRendering='crispEdge'
              />
              <circle
                cx={xPos(d.mpiRural) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill={UNDPColorModule.categoricalColors.locationColors.rural}
              />
              <circle
                cx={xPos(d.mpiUrban) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill={UNDPColorModule.categoricalColors.locationColors.urban}
              />
            </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
