/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending, ascending, extent } from 'd3-array';
import { useRef, useEffect, useState } from 'react';
import { MpiDataTypeDiff } from '../../Types';

interface Props {
  data: MpiDataTypeDiff[];
  diffOption: string;
  sortedByKey: string;
  filterByLabel: string;
  indicatorOption: string;
}
export function DumbellChart(props: Props) {
  const { data, diffOption, sortedByKey, filterByLabel, indicatorOption } =
    props;
  let width = 1280;
  const rightPadding = 120;
  const rowHeight = 35;
  const marginTop = 10;
  const visContainer = useRef(null);
  const [graphWidth, setWidth] = useState<number>(0);
  const [leftPadding, setLeftPadding] = useState<number>(330);
  const [textSize, setTextSize] = useState<number>(1);
  const decimals = indicatorOption === 'mpi' ? 3 : 1;

  if (sortedByKey === 'diff') {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      descending(
        (x as any)[diffOption][indicatorOption],
        (y as any)[diffOption][indicatorOption],
      ),
    );
  } else if (sortedByKey === 'country') {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      ascending((x as any)[sortedByKey], (y as any)[sortedByKey]),
    );
  } else {
    data.sort((x: MpiDataTypeDiff, y: MpiDataTypeDiff) =>
      descending(
        (x as any)[sortedByKey][indicatorOption],
        (y as any)[sortedByKey][indicatorOption],
      ),
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
  // domain depends on gender/location and indicatorOption
  const valuesArray = data.map(
    d =>
      (d as any)[diff1][indicatorOption] && (d as any)[diff2][indicatorOption],
  );
  const domain = extent(valuesArray);
  const xPos = scaleLinear()
    .domain(domain as [number, number])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      width = entries[0].target.clientWidth;
      setWidth(width);
      setLeftPadding(width > 960 ? width / 4 : width / 3);
      setTextSize(width > 960 ? 1 : 0.8);
    });
    if (visContainer.current) resizeObserver.observe(visContainer.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div className='dumbellChart' ref={visContainer}>
      <svg
        width={graphWidth}
        height={
          data.filter(k =>
            filterByLabel === 'All' ? k : k.region === filterByLabel,
          ).length *
            rowHeight +
          marginTop
        }
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
                  fontSize={`${textSize}rem`}
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
                />
                <line
                  x1={xPos((d as any)[diff2][indicatorOption]) + leftPadding}
                  x2={xPos((d as any)[diff1][indicatorOption]) + leftPadding}
                  y1={rowHeight / 2}
                  y2={rowHeight / 2}
                  stroke='#000'
                  strokeWidth={1}
                />
                <circle
                  cx={xPos((d as any)[diff2][indicatorOption]) + leftPadding}
                  cy={rowHeight / 2}
                  r={7}
                  fill={color2}
                />
                <line
                  x1={xPos((d as any)[diff2][indicatorOption]) + leftPadding}
                  x2={
                    (d as any)[diffOption][indicatorOption] < 0
                      ? xPos((d as any)[diff2][indicatorOption]) +
                        leftPadding -
                        10
                      : xPos((d as any)[diff2][indicatorOption]) +
                        leftPadding +
                        10
                  }
                  y1={rowHeight / 2}
                  y2={rowHeight / 2}
                  stroke={color2}
                  strokeWidth={2}
                />
                <text
                  x={
                    (d as any)[diffOption][indicatorOption] < 0
                      ? xPos((d as any)[diff2][indicatorOption]) +
                        leftPadding -
                        15
                      : xPos((d as any)[diff2][indicatorOption]) +
                        leftPadding +
                        15
                  }
                  y={0}
                  dy='22px'
                  fontSize={`${textSize - 0.1}rem`}
                  textAnchor={
                    (d as any)[diffOption][indicatorOption] < 0
                      ? 'end'
                      : 'start'
                  }
                >
                  {Number((d as any)[diff2][indicatorOption]).toFixed(decimals)}
                </text>
                <circle
                  cx={xPos((d as any)[diff1][indicatorOption]) + leftPadding}
                  cy={rowHeight / 2}
                  r={7}
                  fill={color1}
                />
                <line
                  x1={xPos((d as any)[diff1][indicatorOption]) + leftPadding}
                  x2={
                    (d as any)[diffOption][indicatorOption] < 0
                      ? xPos((d as any)[diff1][indicatorOption]) +
                        leftPadding +
                        10
                      : xPos((d as any)[diff1][indicatorOption]) +
                        leftPadding -
                        10
                  }
                  y1={rowHeight / 2}
                  y2={rowHeight / 2}
                  stroke={color1}
                  strokeWidth={2}
                />
                <text
                  x={
                    (d as any)[diffOption][indicatorOption] >= 0
                      ? xPos((d as any)[diff1][indicatorOption]) +
                        leftPadding -
                        15
                      : xPos((d as any)[diff1][indicatorOption]) +
                        leftPadding +
                        15
                  }
                  y={0}
                  dy='22px'
                  fontSize={`${textSize - 0.1}rem`}
                  textAnchor={
                    (d as any)[diffOption][indicatorOption] < 0
                      ? 'start'
                      : 'end'
                  }
                >
                  {Number((d as any)[diff1][indicatorOption]).toFixed(decimals)}
                </text>
                <text
                  x={graphWidth - 80}
                  y={0}
                  dy='22px'
                  fontSize={`${textSize - 0.1}rem`}
                >
                  {(d as any).year}
                </text>
              </g>
            ) : null,
          )}
      </svg>
    </div>
  );
}
