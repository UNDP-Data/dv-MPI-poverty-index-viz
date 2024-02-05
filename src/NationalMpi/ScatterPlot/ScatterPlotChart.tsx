/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { useEffect, useRef, useState } from 'react';
import {
  HoverSubnatDataType,
  MpiDataTypeNational,
  MpiDataTypeLocation,
} from '../../Types';
import { TooltipSubnational } from '../../Components/TooltipSubnational';

interface Props {
  rural?: MpiDataTypeLocation;
  urban?: MpiDataTypeLocation;
  total?: MpiDataTypeNational;
  id: string;
  country: string;
}
export function ScatterPlotChart(props: Props) {
  const { rural, urban, total, id, country } = props;
  const margin = { top: 20, right: 30, bottom: 70, left: 80 };
  const visContainer = useRef(null);
  let width = 400;
  const [graphWidth, setWidth] = useState<number>(0);
  const graphHeight = 310;
  const [hoverData, setHoverData] = useState<HoverSubnatDataType | undefined>(
    undefined,
  );
  const [hoverValue, setHoverValue] = useState<string>('');
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right]);
  const yPos = scaleLinear()
    .domain([80, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const mpiScale = scaleSqrt().domain([0, 1]).range([3, 40]);
  const yAxis = axisLeft(yPos as any)
    .tickFormat((d: any) => `${d}%`)
    .tickSize(-graphWidth + margin.left + margin.right)
    .ticks(5);
  const xAxis = axisBottom(xPos)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}%`)
    .ticks(5);

  useEffect(() => {
    const handleResize = () => {
      if (visContainer.current) {
        width = (visContainer.current as any).offsetWidth;
      }
      setWidth(width);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }, [visContainer.current]);

  useEffect(() => {
    yAxis.tickSize(-graphWidth + margin.top + margin.bottom);
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, [country, graphWidth]);
  return (
    <div ref={visContainer}>
      <svg
        width='100%'
        height='100%'
        viewBox={`0 0 ${graphWidth} ${graphHeight}`}
        id={id}
      >
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className='xAxis'
            transform={`translate(0 ,${
              graphHeight - margin.top - margin.bottom
            })`}
          />
          <g className='yAxis' transform='translate(0,0)' />
          <g
            transform={`translate(
            ${xPos(Number(rural?.headcountRatio))}, 
            ${yPos(Number(rural?.intensity))})`}
            onMouseEnter={event => {
              setHoverValue('rural');
              setHoverData({
                country,
                subregion: 'Rural Areas',
                value: Number(rural?.mpi),
                headcountRatio: Number(rural?.headcountRatio),
                intensity: Number(rural?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverData(undefined);
              setHoverValue('');
            }}
          >
            <circle
              r={mpiScale(Number(rural?.mpi))}
              fill={UNDPColorModule.categoricalColors.locationColors.rural}
              stroke={hoverValue === 'rural' ? '#232E3D' : '#fff'}
            />
          </g>
          <g
            transform={`translate(
            ${xPos(Number(urban?.headcountRatio))}, 
            ${yPos(Number(urban?.intensity))})`}
            onMouseEnter={event => {
              setHoverValue('urban');
              setHoverData({
                country,
                subregion: 'Urban Areas',
                value: Number(urban?.mpi),
                headcountRatio: Number(urban?.headcountRatio),
                intensity: Number(urban?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverValue('');
              setHoverData(undefined);
            }}
          >
            <circle
              r={mpiScale(Number(urban?.mpi))}
              fill={UNDPColorModule.categoricalColors.locationColors.urban}
              stroke={hoverValue === 'urban' ? '#232E3D' : '#fff'}
            />
          </g>
          <g
            transform={`translate(
            ${xPos(Number(total?.headcountRatio))}, 
            ${yPos(Number(total?.intensity))})`}
            onMouseEnter={event => {
              setHoverValue('total');
              setHoverData({
                country,
                subregion: 'Country Total',
                value: Number(total?.mpi),
                headcountRatio: Number(total?.headcountRatio),
                intensity: Number(total?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverData(undefined);
              setHoverValue('');
            }}
          >
            <circle
              r={mpiScale(Number(total?.mpi))}
              fill='#55606E'
              stroke={hoverValue === 'total' ? '#232E3D' : '#fff'}
            />
          </g>
        </g>
        <text x={graphWidth / 2} y={graphHeight - 20} textAnchor='middle'>
          Incidence
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
