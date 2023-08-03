/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear, scaleThreshold } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useState } from 'react';
import { HoverSubnatDataType, MpiDataTypeSubnational } from '../Types';
import { TooltipSubnational } from '../Components/TooltipSubnational';

interface Props {
  data: MpiDataTypeSubnational[];
  id: string;
}
export function ScatterPlotSubnational(props: Props) {
  const { data, id } = props;
  const graphWidth = 700;
  const graphHeight = 520;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const [hoverData, setHoverData] = useState<HoverSubnatDataType | undefined>(
    undefined,
  );
  const [hoverValue, setHoverValue] = useState<string>('');
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([80, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const yAxis = axisLeft(yPos as any)
    .tickSize(-graphWidth + margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(xPos)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}%`);
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx07);
  useEffect(() => {
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, []);

  return (
    <div className='margin-top-06'>
      <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} id={id}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className='xAxis'
            transform={`translate(0 ,${
              graphHeight - margin.bottom - margin.top
            })`}
          />
          <g className='yAxis' transform='translate(0,0)' />
          {data.map((d: any, i: number) => (
            <g
              key={i}
              onMouseEnter={event => {
                setHoverValue(d.subregion);
                setHoverData({
                  country: d.country,
                  subregion: d.subregion,
                  value: Number(d.mpi),
                  headcountRatio: Number(d.headcountRatio),
                  intensity: Number(d.intensity),
                  xPosition: event.clientX,
                  yPosition: event.clientY,
                });
              }}
              onMouseLeave={() => {
                setHoverData(undefined);
                setHoverValue('');
              }}
              transform={`translate(${xPos(Number(d.headcountRatio))}, ${yPos(
                Number(d.intensity),
              )})`}
            >
              <circle
                r={6}
                fill={colorScaleMPI(Number(d.mpi))}
                stroke={
                  hoverValue === d.subregion
                    ? 'var(--gray-700)'
                    : 'var(--gray-500)'
                }
                strokeWidth={1.5}
              />
            </g>
          ))}
        </g>
        <text x={graphWidth / 2} y={graphHeight - 3} textAnchor='middle'>
          Headcount Ratio
        </text>
        <text
          x={-graphHeight / 2}
          y='20'
          transform='rotate(-90)'
          textAnchor='middle'
        >
          Intensity
        </text>
      </svg>
      {hoverData ? <TooltipSubnational data={hoverData} /> : null}
    </div>
  );
}
