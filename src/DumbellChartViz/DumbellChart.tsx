/* eslint-disable import/no-extraneous-dependencies */
// import orderBy from 'lodash.sortby';
// import maxBy from 'lodash.maxby';
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending } from 'd3-array';
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
  const marginTop = 10;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data.sort((x: any, y: any) => descending(x[sortedByKey], y[sortedByKey]));
  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();
  return (
    <div className='dumbellChart'>
      <svg viewBox={`0 0 ${graphWidth} ${data.length * rowHeight + marginTop}`}>
        {data.map((d, i) =>
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
              <text
                x={
                  d.diff < 0
                    ? xPos(d.mpiRural) + leftPadding - 10
                    : xPos(d.mpiRural) + leftPadding + 10
                }
                y={0}
                dy='17px'
                fontSize='14px'
                textAnchor={d.diff < 0 ? 'end' : 'start'}
              >
                {Number(d.mpiRural).toFixed(3)}
              </text>
              <circle
                cx={xPos(d.mpiUrban) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill={UNDPColorModule.categoricalColors.locationColors.urban}
              />
              <text
                x={
                  d.diff >= 0
                    ? xPos(d.mpiUrban) + leftPadding - 10
                    : xPos(d.mpiUrban) + leftPadding + 10
                }
                y={0}
                dy='17px'
                fontSize='14px'
                textAnchor={d.diff < 0 ? 'start' : 'end'}
              >
                {Number(d.mpiUrban).toFixed(3)}
              </text>
            </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
