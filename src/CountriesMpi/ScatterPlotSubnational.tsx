/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import { useEffect } from 'react';
import { MpiDataTypeSubnational } from '../Types';

interface Props {
  data: MpiDataTypeSubnational[];
  id: string;
}
export function ScatterPlotSubnational(props: Props) {
  const { data, id } = props;
  const graphWidth = 800;
  const graphHeight = 700;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  // eslint-disable-next-line no-console
  console.log('data subnational', data);
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([100, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const mpiScale = scaleSqrt().domain([0, 1]).range([2, 20]);
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
    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} id={id}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <g
          className='xAxis'
          transform={`translate(0 ,${
            graphHeight - margin.bottom - margin.top
          })`}
        />
        <g className='yAxis' transform='translate(-40,0)' />
        {data.map((d: any, i: number) => (
          <g
            key={i}
            transform={`translate(${xPos(Number(d.headcountRatio))}, ${yPos(
              Number(d.intensity),
            )})`}
          >
            <circle r={mpiScale(Number(d.mpi))} fill='#A9B1B7' />
            <text y={mpiScale(Number(d.mpi)) + 15} textAnchor='middle'>
              {d.subregion}
            </text>
          </g>
        ))}
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
