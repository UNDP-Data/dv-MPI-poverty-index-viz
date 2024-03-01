/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear } from 'd3-scale';
import { descending, ascending } from 'd3-array';
import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MpiDataTypeSubnational } from '../../Types';

interface Props {
  data: MpiDataTypeSubnational[];
  sortedByKey: string;
}
export function LollipopChart(props: Props) {
  const { data, sortedByKey } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number>(0);
  const leftPadding = 270;
  const rightPadding = 10;
  const rowHeight = 38;
  const marginTop = 10;
  if (sortedByKey === 'subregion') {
    data.sort((x: MpiDataTypeSubnational, y: MpiDataTypeSubnational) =>
      ascending(x.subregion, y.subregion),
    );
  } else {
    data.sort((x: MpiDataTypeSubnational, y: MpiDataTypeSubnational) =>
      descending(
        Number((x as any)[sortedByKey]),
        Number((y as any)[sortedByKey]),
      ),
    );
  }

  let color2: '#55606E';

  const xPos = scaleLinear()
    .domain([0, 1])
    .range([0, svgWidth - leftPadding - rightPadding])
    .nice();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);
  return (
    <div id='listSubnational' ref={containerRef}>
      <svg width={svgWidth} height={data.length * rowHeight + marginTop}>
        {data.map((d, i) =>
          d ? (
            <g key={i} transform={`translate(0,${marginTop + i * rowHeight})`}>
              <text
                x={leftPadding - 20}
                y={rowHeight / 2}
                dy='3px'
                fontSize='0.9rem'
                color='var(--black-500)'
                textAnchor='end'
              >
                {d.subregion}
              </text>
              <line
                x1={leftPadding}
                x2={svgWidth - rightPadding}
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
              <Tooltip title={`Intensity: ${d.intensity.toFixed(2)}%`}>
                <circle
                  cx={xPos((d as any).intensity / 100) + leftPadding}
                  cy={rowHeight / 2}
                  r={5}
                  fill='#fff'
                  stroke='#59BA47'
                  strokeWidth={3}
                />
              </Tooltip>
              <Tooltip
                title={`Headcount Ratio: ${Number(d.headcountRatio).toFixed(
                  2,
                )}%`}
              >
                <circle
                  cx={xPos((d as any).headcountRatio / 100) + leftPadding}
                  cy={rowHeight / 2}
                  r={5}
                  fill='#fff'
                  stroke='#FBC412'
                  strokeWidth={3}
                />
              </Tooltip>
              <text
                x={xPos((d as any).mpi) + leftPadding}
                y={0}
                dy='8px'
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
