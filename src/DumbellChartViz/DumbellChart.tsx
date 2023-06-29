/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending, ascending } from 'd3-array';
import { MpiDataTypeDiff } from '../Types';

interface Props {
  data: MpiDataTypeDiff[];
  diffOption: string;
  sortedByKey: string;
  filterByLabel: string;
}
export function DumbellChart(props: Props) {
  const { data, diffOption, sortedByKey, filterByLabel } = props;
  const graphWidth = 1280;
  const leftPadding = 330;
  const rightPadding = 100;
  const rowHeight = 35;
  const marginTop = 10;

  if (sortedByKey === 'diff') {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      descending((x as any)[diffOption], (y as any)[diffOption]),
    );
  } else if (sortedByKey === 'country') {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      ascending(x[sortedByKey], y[sortedByKey]),
    );
  } else {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      descending((x as any)[sortedByKey], (y as any)[sortedByKey]),
    );
  }
  let diff1: string;
  let diff2: string;
  let color1: string;
  let color2: string;
  if (diffOption === 'gdiff') {
    diff1 = 'mpiMale';
    diff2 = 'mpiFemale';
    color1 = UNDPColorModule.categoricalColors.genderColors.male;
    color2 = UNDPColorModule.categoricalColors.genderColors.female;
  } else {
    diff1 = 'mpiUrban';
    diff2 = 'mpiRural';
    color1 = UNDPColorModule.categoricalColors.locationColors.urban;
    color2 = UNDPColorModule.categoricalColors.locationColors.rural;
  }
  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();

  return (
    <div className='dumbellChart'>
      <svg
        viewBox={`0 0 ${graphWidth} ${
          data.filter(k =>
            filterByLabel === 'All' ? k : k.region === filterByLabel,
          ).length *
            rowHeight +
          marginTop
        }`}
      >
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
                  x1={xPos((d as any)[diff2]) + leftPadding}
                  x2={xPos((d as any)[diff1]) + leftPadding}
                  y1={rowHeight / 2}
                  y2={rowHeight / 2}
                  stroke='#000'
                  strokeWidth={1}
                  shapeRendering='crispEdge'
                />
                <circle
                  cx={xPos((d as any)[diff2]) + leftPadding}
                  cy={rowHeight / 2}
                  r={7}
                  fill={color2}
                />
                <text
                  x={
                    (d as any)[diffOption] < 0
                      ? xPos((d as any)[diff2]) + leftPadding - 15
                      : xPos((d as any)[diff2]) + leftPadding + 15
                  }
                  y={0}
                  dy='22px'
                  fontSize='14px'
                  textAnchor={(d as any)[diffOption] < 0 ? 'end' : 'start'}
                >
                  {Number((d as any)[diff2]).toFixed(3)}
                </text>
                <circle
                  cx={xPos((d as any)[diff1]) + leftPadding}
                  cy={rowHeight / 2}
                  r={7}
                  fill={color1}
                />
                <text
                  x={
                    (d as any)[diffOption] >= 0
                      ? xPos((d as any)[diff1]) + leftPadding - 15
                      : xPos((d as any)[diff1]) + leftPadding + 15
                  }
                  y={0}
                  dy='22px'
                  fontSize='14px'
                  textAnchor={(d as any)[diffOption] < 0 ? 'start' : 'end'}
                >
                  {Number((d as any)[diff1]).toFixed(3)}
                </text>
                <text x={graphWidth - 80} y={0} dy='22px' fontSize='14px'>
                  {(d as any).year}
                </text>
              </g>
            ) : null,
          )}
      </svg>
    </div>
  );
}
