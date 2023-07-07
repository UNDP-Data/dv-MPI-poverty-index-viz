/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select, selectAll } from 'd3-selection';
import { useEffect } from 'react';
import { MpiDataType, MpiDataTypeLocation } from '../Types';

interface Props {
  rural?: MpiDataTypeLocation;
  urban?: MpiDataTypeLocation;
  total?: MpiDataType;
}
export function ScatterPlot(props: Props) {
  const { rural, urban, total } = props;
  const graphWidth = 700;
  const graphHeight = 600;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  // eslint-disable-next-line no-console
  console.log('rural, urban, total', urban, rural, total);
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([100, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const mpiScale = scaleSqrt().domain([0, 1]).range([2, 40]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useEffect(() => {
    select('.yAxis').call(
      axisLeft(yPos)
        .tickSize(-graphWidth - margin.left + margin.right)
        .tickFormat((d: any) => `${d}%`),
    );
    select('.xAxis').call(
      axisBottom(xPos)
        .tickSize(0)
        .tickSizeOuter(0)
        .tickPadding(4)
        .tickFormat((d: any) => `${d}%`),
    );
    selectAll('.domain').remove();
    selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '0')
      .attr('text-anchor', 'start');
  }, []);

  return (
    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          className='xAxis'
          transform={`translate(0 ,${
            graphHeight - margin.bottom - margin.top
          })`}
        />
        <g className='yAxis' transform='translate(-40,0)' />
        <g
          transform={`translate(${xPos(Number(rural?.headcountRatio))}, ${yPos(
            Number(rural?.intensity),
          )})`}
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
          transform={`translate(${xPos(Number(urban?.headcountRatio))}, ${yPos(
            Number(urban?.intensity),
          )})`}
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
          transform={`translate(${xPos(Number(total?.headcountRatio))}, ${yPos(
            Number(total?.intensity),
          )})`}
        >
          <circle r={mpiScale(Number(total?.mpi))} fill='#A9B1B7' />
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
  );
}
