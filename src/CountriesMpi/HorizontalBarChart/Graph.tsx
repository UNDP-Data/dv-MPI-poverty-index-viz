/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import { extent, descending } from 'd3-array';
import { axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeNationalYears } from '../../Types';

interface Props {
  data: MpiDataTypeNationalYears[];
  svgWidth: number;
  svgHeight: number;
}

export function Graph(props: Props) {
  const id = 'annualizedChangeBarChart';
  const { data, svgWidth, svgHeight } = props;
  const margin = { top: 20, right: 20, bottom: 50, left: 200 };
  const graphWidth = svgWidth - margin.left - margin.right;
  const graphHeight = svgHeight - margin.top - margin.bottom;
  data.sort((a, b) =>
    descending(a.annualizedChangeHeadcount, b.annualizedChangeHeadcount),
  );
  const xDomain = extent(
    data,
    (d: MpiDataTypeNationalYears) => d.annualizedChangeHeadcount,
  );
  const y = scaleBand() // country
    .domain(data.map(d => d.country))
    .range([0, graphHeight])
    .padding(0.1);

  const x = scaleLinear()
    .domain(xDomain as [number, number])
    .range([0, graphWidth])
    .nice();

  const yAxis = axisLeft(y).tickSize(0).tickSizeOuter(0).tickPadding(50);

  useEffect(() => {
    const svg = select(`#${id}`);
    svg.select('.yAxis').call(yAxis as any);
    svg.selectAll('.domain').remove();
    svg.selectAll('.yAxis text').style('text-anchor', 'end').attr('dy', '0');
  }, [data]);
  return (
    <div>
      {data.length > 0 ? (
        <svg width={svgWidth} height={svgHeight} id={id}>
          <g transform={`translate(${margin.left},${margin.top})`}>
            <g
              className='yAxis'
              transform={`translate(${margin.left + x(0)}, 0})`}
            />
            <g>
              {data.map((d, i) => (
                <g key={i}>
                  <rect
                    y={y((d as any).country)}
                    x={x(Math.min(0, d.annualizedChangeHeadcount))}
                    height={y.bandwidth()}
                    width={Math.abs(x(d.annualizedChangeHeadcount) - x(0))}
                    fill={UNDPColorModule.categoricalColors.colors[0]}
                  />
                  <text
                    className='label'
                    y={y((d as any).country)}
                    dy={y.bandwidth() / 2 + 7}
                    x={
                      (d as any).annualizedChangeHeadcount < 0
                        ? x((d as any).annualizedChangeHeadcount) - 10
                        : x((d as any).annualizedChangeHeadcount) + 10
                    }
                    textAnchor={
                      (d as any).annualizedChangeHeadcount < 0 ? 'end' : 'start'
                    }
                  >
                    {(d as any).annualizedChangeHeadcount.toFixed(2)}
                  </text>
                </g>
              ))}
            </g>
            <line
              x1={x(0)}
              y1={0}
              x2={x(0)}
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
