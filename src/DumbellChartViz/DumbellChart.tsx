/* eslint-disable import/no-extraneous-dependencies */
// import orderBy from 'lodash.sortby';
// import maxBy from 'lodash.maxby';
// import { useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending, ascending } from 'd3-array';
import { MpiDataTypeUrbanRural } from '../Types';

interface Props {
  data: MpiDataTypeUrbanRural[];
  sortedByKey: string;
  filterByLabel: string;
}

export function DumbellChart(props: Props) {
  const { data, sortedByKey, filterByLabel } = props;
  const graphWidth = 1280;
  const leftPadding = 300;
  const rightPadding = 100;
  const rowHeight = 35;
  const marginTop = 10;
  // const [regions, setRegions] = useState<string[]>();
  // eslint-disable-next-line no-console
  console.log('sortedByKey', sortedByKey);

  if (sortedByKey === 'diff') {
    data.sort((x: MpiDataTypeUrbanRural, y: MpiDataTypeUrbanRural) =>
      descending(x[sortedByKey], y[sortedByKey]),
    );
  } else if (sortedByKey === 'country') {
    data.sort((x: MpiDataTypeUrbanRural, y: MpiDataTypeUrbanRural) =>
      ascending(x[sortedByKey], y[sortedByKey]),
    );
  }

  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();

  return (
    <div className='dumbellChart'>
      <svg viewBox={`0 0 ${graphWidth} ${data.length * rowHeight + marginTop}`}>
        {data
          .filter(k =>
            filterByLabel === 'All' ? k : k.region === filterByLabel,
          )
          .map((d, i) =>
            d ? (
              <g
                key={i}
                transform={`translate(0,${marginTop + i * rowHeight})`}
              >
                <text
                  x={0}
                  y={rowHeight / 2}
                  dy='3px'
                  fontSize='0.9rem'
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
                  x1={xPos(d.mpiRural) + leftPadding}
                  x2={xPos(d.mpiUrban) + leftPadding}
                  y1={rowHeight / 2}
                  y2={rowHeight / 2}
                  stroke='#000'
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
                      ? xPos(d.mpiRural) + leftPadding - 15
                      : xPos(d.mpiRural) + leftPadding + 15
                  }
                  y={0}
                  dy='22px'
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
                      ? xPos(d.mpiUrban) + leftPadding - 15
                      : xPos(d.mpiUrban) + leftPadding + 15
                  }
                  y={0}
                  dy='22px'
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
