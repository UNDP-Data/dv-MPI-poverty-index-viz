/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending, ascending } from 'd3-array';
import { MpiDataTypeSubnational } from '../../Types';

interface Props {
  data: MpiDataTypeSubnational[];
  sortedByKey: string;
}
export function LollipopChart(props: Props) {
  const { data, sortedByKey } = props;
  const graphWidth = 700;
  const leftPadding = 200;
  const rightPadding = 10;
  const rowHeight = 35;
  const marginTop = 10;

  if (sortedByKey === 'mpi') {
    data.sort((x: MpiDataTypeSubnational, y: MpiDataTypeSubnational) =>
      descending(x.mpi, y.mpi),
    );
  } else if (sortedByKey === 'subregion') {
    data.sort((x: MpiDataTypeSubnational, y: MpiDataTypeSubnational) =>
      ascending(x.subregion, y.subregion),
    );
  }

  let color2: '#55606E';

  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();

  return (
    <div className='scrollbar-visible'>
      <svg viewBox={`0 0 ${graphWidth} ${data.length * rowHeight + marginTop}`}>
        {data.map((d, i) =>
          d ? (
            <g key={i} transform={`translate(0,${marginTop + i * rowHeight})`}>
              <text
                x={leftPadding - 20}
                y={rowHeight / 2}
                dy='3px'
                fontSize='1rem'
                color='var(--black-500)'
                textAnchor='end'
              >
                {d.subregion}
              </text>
              <line
                x1={leftPadding}
                x2={graphWidth - rightPadding}
                y1={rowHeight / 2}
                y2={rowHeight / 2}
                stroke='#FFF'
                strokeWidth={3}
                shapeRendering='crispEdge'
              />
              <line
                x1={leftPadding}
                x2={xPos((d as any).mpi) + leftPadding}
                y1={rowHeight / 2}
                y2={rowHeight / 2}
                stroke='#D4D6D8'
                strokeWidth={3}
                shapeRendering='crispEdge'
              />
              <circle
                cx={xPos((d as any).mpi) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill={color2}
              />
              <circle
                cx={xPos((d as any).intensity / 100) + leftPadding}
                cy={rowHeight / 2}
                r={5}
                fill='#fff'
                stroke='#59BA47'
                strokeWidth={3}
              />
              <circle
                cx={xPos((d as any).headcountRatio / 100) + leftPadding}
                cy={rowHeight / 2}
                r={5}
                fill='#fff'
                stroke='#FBC412'
                strokeWidth={3}
              />
              <text
                x={xPos((d as any).mpi) + leftPadding}
                y={0}
                dy='6px'
                fontSize='14px'
                textAnchor='middle'
              >
                {Number((d as any).mpi).toFixed(3)}
              </text>
            </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
