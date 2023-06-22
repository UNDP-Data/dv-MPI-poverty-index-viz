// import sortBy from 'lodash.sortby';
// import maxBy from 'lodash.maxby';
// eslint-disable-next-line import/no-extraneous-dependencies
import { scaleLinear } from 'd3-scale';
import { MpiDataTypeUrbanRural } from '../Types';

interface Props {
  data: MpiDataTypeUrbanRural[];
}

export function DumbellChart(props: Props) {
  const { data } = props;
  const graphWidth = 1280;
  const leftPadding = 230;
  const rightPadding = 200;
  const rowHeight = 35;
  const marginTop = 50;
  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();
  return (
    <div>
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
                strokeDasharray='4 8'
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
                fill='#E26B8D'
              />
              <circle
                cx={xPos(d.mpiUrban) + leftPadding}
                cy={rowHeight / 2}
                r={7}
                fill='#266291'
              />
            </g>
          ) : null,
        )}
      </svg>
    </div>
  );
}
