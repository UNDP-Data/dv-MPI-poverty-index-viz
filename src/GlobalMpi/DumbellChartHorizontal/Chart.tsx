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
  const margin = { top: 40, right: 30, bottom: 80, left: 40 };
  const graphHeight = 400;
  const minBarWidth = 13;
  const graphPadding = 10;
  const visContainer = useRef(null);
  const [graphWidth, setWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(16);
  const indicators = [
    { ind: 'headcountRatio', label: 'MPI Headcount Ratio' },
    { ind: 'povertyWB', label: 'PPP $2.15 a day 2011-2021' },
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
      const barSize =
        (width - margin.left - margin.right - 2 * graphPadding) /
        dataDiff.length;
      console.log('width', width, 'barSize', barSize);
      setBarWidth(barSize > minBarWidth ? barSize : minBarWidth);
      setContainerWidth(width);
      setWidth(
        barSize > minBarWidth
          ? width
          : dataDiff.length * minBarWidth +
              margin.left +
              margin.right +
              2 * graphPadding,
      );
    };
    handleResize();
    window.addEventListener('resize', handleResize);
  }, []);
  return (
    <div ref={visContainer}>
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
              <g
                key={i}
                transform={`translate(${i * barWidth + graphPadding}, 0)`}
              >
                <line
                  x1={barWidth / 2}
                  x2={barWidth / 2}
                  y2={graphHeight - margin.top - margin.bottom + 15}
                  y1={y(d.headcountRatio)}
                  stroke='#A9B1B7'
                  strokeWidth={1}
                  opacity={hoveredCountry === (d as any).country ? 1 : 0}
                />
                <line
                  x1={barWidth / 2}
                  x2={barWidth / 2}
                  y1={y(d.povertyWB)}
                  y2={y(d.headcountRatio)}
                  stroke={
                    hoveredCountry === (d as any).country ? '#000' : '#55606E'
                  }
                  strokeWidth='1'
                />
                <circle
                  cx={barWidth / 2}
                  cy={y(d.povertyWB)}
                  r={hoveredCountry === (d as any).country ? 10 : 6}
                  fill={UNDPColorModule.categoricalColors.colors[0]}
                />
                <circle
                  cx={barWidth / 2}
                  cy={y(d.headcountRatio)}
                  r={hoveredCountry === (d as any).country ? 9 : 6}
                  fill={UNDPColorModule.categoricalColors.colors[1]}
                />
                <g className='focus' style={{ display: 'block' }} key={i}>
                  <g
                    transform={`translate(${
                      i * barWidth < containerWidth - 200 ? 0 : -200
                    },${graphHeight - margin.top})`}
                    opacity={hoveredCountry === (d as any).country ? 1 : 0}
                  >
                    <text y='-50' x={-barWidth} className='tooltipValue'>
                      {d.country}, (difference: {d.diff.toFixed(2)}%)
                    </text>
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
                          />
                          <text className='tooltipLabel' x={10} y={5}>
                            {(d as any)[k.ind]
                              ? `${k.label}: ${(d as any)[k.ind]}%`
                              : '-'}
                          </text>
                        </g>
                      </g>
                    ))}
                  </g>
                  <rect
                    onMouseEnter={() => {
                      setHoveredCountry((d as any).country);
                    }}
                    onMouseLeave={() => {
                      setHoveredCountry('Mali');
                    }}
                    x={0}
                    y={0}
                    width={barWidth}
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
