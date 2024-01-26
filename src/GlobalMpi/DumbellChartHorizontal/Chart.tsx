/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { descending } from 'd3-array';
import { axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
import UNDPColorModule from 'undp-viz-colors';
import { useRef, useEffect, useState } from 'react';
import { MpiDataType } from '../../Types';

interface Props {
  data: MpiDataType[];
}
export function Chart(props: Props) {
  const { data } = props;
  const [hoveredCountry, setHoveredCountry] = useState<undefined | string>(
    undefined,
  );
  let width = 1280;
  const margin = { top: 60, right: 20, bottom: 30, left: 50 };
  const graphHeight = 400;

  const visContainer = useRef(null);
  const [graphWidth, setWidth] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(16);
  const indicators = [
    { ind: 'povertyWB', label: 'PPP $2.15 a day 2011-2021' },
    { ind: 'headcountRatio', label: 'MPI Headcount Ratio' },
  ];

  const y = scaleLinear()
    .domain([100, 0])
    .range([0, graphHeight - margin.top - margin.bottom])
    .nice();

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth + margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);

  const dataDiff: any[] = data
    .filter(d => Number(d.povertyWB))
    .map((d: any) => ({
      ...d,
      diff: Number(d.headcountRatio) - Number(d.povertyWB),
    }));
  dataDiff.sort((a, b) => descending(Number(a.diff), Number(b.diff)));

  const svg = select('#povertyWB');
  svg.select('.yAxis').call(yAxis as any);
  svg.selectAll('.domain').remove();
  svg
    .selectAll('.yAxis text')
    .attr('dy', '-4px')
    .attr('x', '-4px')
    .attr('text-anchor', 'end');

  useEffect(() => {
    const handleResize = () => {
      if (visContainer.current)
        width = (visContainer.current as any).offsetWidth;
      setWidth(width);
      setBarWidth((width - margin.left - margin.right) / dataDiff.length);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);
  return (
    <div className='dumbellChart' ref={visContainer}>
      <div className='legend-container'>
        {indicators.map((k, j) => (
          <div key={j} className='legend-item'>
            <div
              className='legend-circle-medium'
              style={{
                backgroundColor: UNDPColorModule.categoricalColors.colors[j],
              }}
            />
            <div className='small-font'>{k.label}</div>
          </div>
        ))}
      </div>
      <svg width={graphWidth} height={graphHeight} id='povertyWB'>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g className='yAxis' transform='translate(0,0)' />
          {dataDiff
            .filter(d => Number(d.povertyWB))
            .map((d, i) => (
              <g key={i} transform={`translate(${i * barWidth}, 0)`}>
                <line
                  x1={barWidth / 2}
                  x2={barWidth / 2}
                  y1={y(d.povertyWB)}
                  y2={y(d.headcountRatio)}
                  stroke='#000'
                  strokeWidth={1}
                />
                <circle
                  cx={barWidth / 2}
                  cy={y(d.povertyWB)}
                  r={
                    hoveredCountry === (d as any).country
                      ? barWidth / 2 + 1
                      : barWidth / 2 - 3
                  }
                  fill={UNDPColorModule.categoricalColors.colors[0]}
                />
                <circle
                  cx={barWidth / 2}
                  cy={y(d.headcountRatio)}
                  r={
                    hoveredCountry === (d as any).country
                      ? barWidth / 2
                      : barWidth / 2 - 3
                  }
                  fill={UNDPColorModule.categoricalColors.colors[1]}
                />
                <g
                  className='focus'
                  style={{ display: 'block' }}
                  key={i}
                  transform={`translate(${barWidth},0)`}
                >
                  {hoveredCountry === (d as any).country ? (
                    <text y='-50' x={-barWidth} className='tooltipValue'>
                      {d.country}, (difference: {d.diff.toFixed(2)}%)
                    </text>
                  ) : null}
                  {indicators.map((k, j) => (
                    <g
                      key={j}
                      style={{
                        display: (d as any)[k.ind] !== '' ? 'block' : 'none',
                      }}
                    >
                      <g
                        transform={`translate(${-barWidth / 2},${
                          -32 + j * 18
                        })`}
                      >
                        <circle
                          r={5}
                          fill={UNDPColorModule.categoricalColors.colors[j]}
                          opacity={
                            hoveredCountry === (d as any).country ? 1 : 0
                          }
                        />
                        <text
                          className='tooltipLabel'
                          x={i > dataDiff.length - 3 ? -60 : 10}
                          y={5}
                          opacity={
                            hoveredCountry === (d as any).country ? 1 : 0
                          }
                        >
                          {(d as any)[k.ind]
                            ? `${k.label}: ${(d as any)[k.ind]}%`
                            : '-'}
                        </text>
                      </g>
                      <line
                        x1={-barWidth / 2}
                        x2={-barWidth / 2}
                        y1={0}
                        y2={y(d.headcountRatio)}
                        stroke='#000'
                        strokeWidth={1}
                        opacity={
                          hoveredCountry === (d as any).country ? 0.7 : 0
                        }
                      />
                      <rect
                        x={0}
                        y={graphHeight}
                        width={barWidth}
                        height={20}
                        fill='#F8F8F8'
                        opacity={
                          hoveredCountry === (d as any).country ? 0.7 : 0
                        }
                      />
                    </g>
                  ))}
                  <rect
                    onMouseEnter={() => {
                      setHoveredCountry((d as any).country);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry(undefined);
                    }}
                    x='-15px'
                    y={0}
                    width='30px'
                    height={graphHeight}
                    opacity={0}
                  />
                </g>
              </g>
            ))}
        </g>
      </svg>
    </div>
  );
}
