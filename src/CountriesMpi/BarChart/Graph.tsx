/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataType } from '../../Types';

interface Props {
  data: MpiDataType[];
  radioOption: object;
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const id = 'mpiBarChart';
  const { data, radioOption, svgWidth, svgHeight } = props;
  const reversedData = [...data].reverse();
  const margin = { top: 20, right: 30, bottom: 50, left: 40 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  const minParam = 0;
  const valueArray: number[] = reversedData.map((d: any) =>
    Number(d[(radioOption as any).value]),
  );
  const maxParam = max(valueArray) ? max(valueArray) : 0;
  const xDomain: any[] = [];

  reversedData.forEach((d: any) => {
    if (d[(radioOption as any).value] !== '') xDomain.push(d.year);
  });
  const x = scaleBand()
    .domain(xDomain as [])
    .range([0, graphWidth])
    .padding(0.1);
  const y = scaleLinear()
    .domain([minParam as number, maxParam as number])
    .range([graphHeight, 0])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth)
    .ticks(5);
  // .tickFormat(radioOption === 'headcountRatio' ? '%' : '');
  const xAxis = axisBottom(x).tickSize(0).tickSizeOuter(0).tickPadding(6);
  //  .tickFormat((d: any) => (d % 5 !== 0 ? '' : `${d}`));
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
  }, [data, radioOption]);
  return (
    <div>
      {valueArray.length > 0 ? (
        <svg width={svgWidth} height={svgHeight} id={id}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g className='xAxis' transform={`translate(0 ,${graphHeight})`} />
            <g className='yAxis' transform='translate(0,0)' />
            <g>
              {reversedData.map((d, i) => (
                <g key={i}>
                  <rect
                    x={x((d as any).year)}
                    y={y((d as any)[(radioOption as any).value])}
                    width={x.bandwidth()}
                    height={
                      graphHeight - y((d as any)[(radioOption as any).value])
                    }
                    fill={UNDPColorModule.categoricalColors.colors[0]}
                    opacity={0.8}
                  />
                  <text
                    className='barLabel'
                    x={x((d as any).year)}
                    dx={x.bandwidth() / 2}
                    y={y((d as any)[(radioOption as any).value]) - 5}
                    opacity={i >= xDomain.length ? 0 : 1}
                  >
                    {' '}
                    {(radioOption as any).value === 'headcountRatio'
                      ? `${Number(
                          (d as any)[(radioOption as any).value],
                        ).toFixed(1)}%`
                      : Number((d as any)[(radioOption as any).value]).toFixed(
                          3,
                        )}
                  </text>
                </g>
              ))}
            </g>
            <line
              x1={0}
              y1={graphHeight}
              x2={graphWidth}
              y2={graphHeight}
              stroke='#232E3D'
              strokeWidth={2}
            />
          </g>
        </svg>
      ) : (
        <div className='center-area-error-el'>No data available</div>
      )}
    </div>
  );
}
