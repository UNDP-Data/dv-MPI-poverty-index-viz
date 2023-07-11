/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { useEffect, useState } from 'react';
import {
  HoverSubnatDataType,
  MpiDataType,
  MpiDataTypeLocation,
} from '../Types';
import { TooltipSubnational } from '../Components/TooltipSubnational';

interface Props {
  rural?: MpiDataTypeLocation;
  urban?: MpiDataTypeLocation;
  total?: MpiDataType;
  id: string;
  country: string;
}
export function ScatterPlot(props: Props) {
  const { rural, urban, total, id, country } = props;
  const graphWidth = 700;
  const graphHeight = 600;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const [hoverData, setHoverData] = useState<HoverSubnatDataType | undefined>(
    undefined,
  );
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([100, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const mpiScale = scaleSqrt().domain([0, 1]).range([2, 40]);
  const yAxis = axisLeft(yPos as any)
    .tickSize(-graphWidth - margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(xPos)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(4)
    .tickFormat((d: any) => `${d}%`);

  useEffect(() => {
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '0')
      .attr('text-anchor', 'start');
  }, []);

  return (
    <div>
      <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} id={id}>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className='xAxis'
            transform={`translate(0 ,${
              graphHeight - margin.bottom - margin.top
            })`}
          />
          <g className='yAxis' transform='translate(-40,0)' />
          <g
            transform={`translate(
            ${xPos(Number(rural?.headcountRatio))}, 
            ${yPos(Number(rural?.intensity))})`}
            onMouseEnter={event => {
              setHoverData({
                country,
                subregion: 'Rural Areas',
                value: Number(rural?.mpi),
                year: '',
                headcountRatio: Number(rural?.headcountRatio),
                intensity: Number(rural?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverData(undefined);
            }}
          >
            <circle
              r={mpiScale(Number(rural?.mpi))}
              fill={UNDPColorModule.categoricalColors.locationColors.rural}
            />
            <text y={mpiScale(Number(rural?.mpi)) + 15} textAnchor='middle'>
              Rural
            </text>
          </g>
          <g
            transform={`translate(
            ${xPos(Number(urban?.headcountRatio))}, 
            ${yPos(Number(urban?.intensity))})`}
            onMouseEnter={event => {
              setHoverData({
                country,
                subregion: 'Urban Areas',
                value: Number(urban?.mpi),
                year: '',
                headcountRatio: Number(urban?.headcountRatio),
                intensity: Number(urban?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverData(undefined);
            }}
          >
            <circle
              r={mpiScale(Number(urban?.mpi))}
              fill={UNDPColorModule.categoricalColors.locationColors.urban}
            />
            <text y={mpiScale(Number(urban?.mpi)) + 15} textAnchor='middle'>
              Urban
            </text>
          </g>
          <g
            transform={`translate(
            ${xPos(Number(total?.headcountRatio))}, 
            ${yPos(Number(total?.intensity))})`}
            onMouseEnter={event => {
              setHoverData({
                country,
                subregion: 'Country Total',
                value: Number(total?.mpi),
                year: '',
                headcountRatio: Number(total?.headcountRatio),
                intensity: Number(total?.intensity),
                xPosition: event.clientX,
                yPosition: event.clientY,
              });
            }}
            onMouseLeave={() => {
              setHoverData(undefined);
            }}
          >
            <circle
              r={mpiScale(Number(total?.mpi))}
              fill='#55606E'
              stroke='#888'
            />
            <text y={mpiScale(Number(total?.mpi)) + 15} textAnchor='middle'>
              Total
            </text>
          </g>
        </g>
        <text x={graphWidth / 2} y={graphHeight} textAnchor='middle'>
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
