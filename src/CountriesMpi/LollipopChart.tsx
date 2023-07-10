/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { MpiDataTypeSubnational } from '../Types';

interface Props {
  data: MpiDataTypeSubnational[];
}
export function LollipopChart(props: Props) {
  const { data } = props;
  const graphWidth = 1280;
  const graphHeight = 600;
  const leftPadding = 330;
  const rightPadding = 100;
  const rowHeight = 35;
  const marginTop = 10;

  let color2: '#CCC';

  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();

  return (
    <div className='dumbellChart'>
      <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
        {data.map((d, i) =>
          d ? (
            <g key={i} transform={`translate(0,${marginTop + i * rowHeight})`}>
              <text
                x={0}
                y={rowHeight / 2}
                dy='3px'
                fontSize='1rem'
                color='var(--black-500)'
              >
                {d.country}
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
                x1={xPos((d as any)[0]) + leftPadding}
                x2={xPos((d as any).mpi) + leftPadding}
                y1={rowHeight / 2}
                y2={rowHeight / 2}
                stroke='#000'
                strokeWidth={1}
                shapeRendering='crispEdge'
              />
              <circle
                cx={xPos((d as any).mpi) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill={color2}
              />
              <text
                x={xPos((d as any).mpi) + leftPadding + 15}
                y={0}
                dy='22px'
                fontSize='14px'
                textAnchor='start'
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
