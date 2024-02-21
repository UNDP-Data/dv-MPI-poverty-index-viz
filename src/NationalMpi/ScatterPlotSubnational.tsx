/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { scaleLinear, scaleQuantize } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useRef, useState } from 'react';
import { HoverSubnatDataType, MpiDataTypeSubnational } from '../Types';
import { TooltipSubnational } from './TooltipSubnational';

interface Props {
  data: MpiDataTypeSubnational[];
  id: string;
  activeViz: string;
  subnationalMPIextent: [number, number];
}
export function ScatterPlotSubnational(props: Props) {
  const { data, id, activeViz, subnationalMPIextent } = props;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number>(0);
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

  const colorScaleMPI = scaleQuantize<string, number>()
    .domain(subnationalMPIextent as [number, number])
    .range(UNDPColorModule.sequentialColors.negativeColorsx05);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      setSvgWidth(entries[0].target.clientWidth);
    });
    if (containerRef.current) resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

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
  }, [svgWidth, activeViz]);

  useEffect(() => {
    colorScaleMPI.domain(subnationalMPIextent as [number, number]);
  }, [subnationalMPIextent]);
  return (
    <div
      style={{ minWidth: '600px' }}
      ref={containerRef}
      id='scatterplotSubnational'
    >
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
          Incidence
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
