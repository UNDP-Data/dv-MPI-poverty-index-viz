/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
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
  let width = 1280;
  const margin = { top: 40, right: 20, bottom: 80, left: 40 };
  const graphHeight = 400;
  const minBarWidth = 13;
  const graphPadding = 10;
  const visContainer = useRef(null);
  const [graphWidth, setWidth] = useState<number>(0);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [barWidth, setBarWidth] = useState<number>(16);
  const indicators = [
    { ind: 'headcountRatio', label: 'MPI incidence' },
    { ind: 'povertyWB', label: 'Extreme monetary poverty incidence' },
  ];

  const y = scaleLinear()
    .domain([100, 0])
    .range([0, graphHeight - margin.top - margin.bottom])
    .nice();

  const colorScale = scaleOrdinal<string>()
    .domain(indicators.map(d => d.ind))
    .range([
      UNDPColorModule.categoricalColors.colors[5],
      UNDPColorModule.categoricalColors.colors[6],
    ]);

  const yAxis = axisLeft(y as any)
    .tickSize(-graphWidth + margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);

  const dataDiff: any[] = data
    .filter(d => d.povertyWB >= 0)
    .map((d: any) => ({
      ...d,
      diff: Number(d.headcountRatio) - Number(d.povertyWB),
    }));
  dataDiff.sort((a, b) => descending(Number(a.diff), Number(b.diff)));
  // find position of first negative diff value in the array
  const xDivider = dataDiff.filter(d => d.diff > 0).length;
  const [hoveredCountry, setHoveredCountry] = useState<undefined | string>(
    dataDiff[0].country,
  );
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
                backgroundColor: colorScale(k.ind),
              }}
            />
            <div className='small-font'>{k.label}</div>
          </div>
        ))}
      </div>
      <svg width={graphWidth} height={graphHeight} id='povertyWB'>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <rect
            x='0'
            y='0'
            width={xDivider * barWidth + barWidth / 2}
            height={graphHeight - margin.bottom - margin.top}
            fill='#fff'
            strokeWidth={0}
          />
          <g className='yAxis' transform='translate(0,0)' />
          {dataDiff.map((d, i) => (
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
                r={hoveredCountry === (d as any).country ? 9 : 5}
                fill={colorScale('povertyWB')}
              />
              <circle
                cx={barWidth / 2}
                cy={y(d.headcountRatio)}
                r={hoveredCountry === (d as any).country ? 8 : 5}
                fill={colorScale('headcountRatio')}
              />
              <g className='focus' style={{ display: 'block' }} key={i}>
                <g
                  transform={`translate(${
                    i * barWidth < containerWidth - 350 ? 0 : -230
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
                        <circle r={5} fill={colorScale(k.ind)} />
                        <text className='tooltipLabel' x={10} y={5}>
                          {`${k.label}: ${(d as any)[k.ind]}%`}
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
          <line
            x1={xDivider * barWidth + barWidth / 2}
            x2={xDivider * barWidth + barWidth / 2}
            y1='-35'
            y2={graphHeight - margin.bottom - margin.top}
            strokeWidth={1}
            style={{ stroke: 'var(--gray-500)', strokeDasharray: '1' }}
          />
          <text
            x={xDivider * barWidth}
            y={-15}
            textAnchor='end'
            className='label'
            style={{ fill: 'var(--gray-700)' }}
          >
            Countries with MPI Incidence greater than extreme poverty Incidence
          </text>
        </g>
      </svg>
    </div>
  );
}
