/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear, scaleThreshold } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { HoverSubnatDataType, MpiDataTypeSubnational } from '../Types';
import { TooltipSubnational } from '../Components/TooltipSubnational';

interface Props {
  data: MpiDataTypeSubnational[];
  id: string;
  activeViz: string;
}
export function ScatterPlotSubnational(props: Props) {
  const { data, id, activeViz } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const visContainer = useRef(null);
  let width = 800;
  const [svgWidth, setWidth] = useState<number>(0);
  const svgHeight = 500;
  const [hoverData, setHoverData] = useState<HoverSubnatDataType | undefined>(
    undefined,
  );
  const [hoverValue, setHoverValue] = useState<string>('');
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, svgWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([80, 0])
    .range([0, svgHeight - margin.top - margin.bottom]);
  const yAxis = axisLeft(yPos as any)
    .tickSize(-svgWidth + margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(xPos)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}%`)
    .ticks(10);
  const valueArray = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
  const colorScaleMPI = scaleThreshold<number, string>()
    .domain(valueArray)
    .range(UNDPColorModule.sequentialColors.negativeColorsx07);

  useEffect(() => {
    const handleResize = () => {
      if (visContainer.current) {
        width = (visContainer.current as any).offsetWidth;
      }
      setWidth(width);
    };
    if (activeViz === 'scatterplot') handleResize();
    window.addEventListener('resize', handleResize);
  }, [visContainer.current, activeViz]);

  useEffect(() => {
    yAxis.tickSize(-svgWidth + margin.left + margin.right);
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [svgWidth]);

  return (
    <div ref={visContainer} style={{ minWidth: '600px' }}>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        id={id}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className='xAxis'
            transform={`translate(0 ,${
              svgHeight - margin.bottom - margin.top
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
        <text x={svgWidth / 2} y={svgHeight - 3} textAnchor='middle'>
          Headcount Ratio
        </text>
        <text
          x={-svgHeight / 2}
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
