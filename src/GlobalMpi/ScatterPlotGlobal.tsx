/* eslint-disable @typescript-eslint/no-explicit-any */
import { Radio, RadioChangeEvent } from 'antd';
import { scaleLinear, scaleOrdinal } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { select } from 'd3-selection';
// import UNDPColorModule from 'undp-viz-colors';
import { useEffect, useState } from 'react';
import { HoverDataType, MpiDataType } from '../Types';
import { Tooltip } from '../Components/Tooltip';

interface Props {
  data: MpiDataType[];
}
const regionsOptions = [
  'Arab States',
  'East Asia and the Pacific',
  'Europe and Central Asia',
  'Latin America and the Caribbean',
  'South Asia',
  'Sub-Saharan Africa',
];
const regionColors = [
  '#006eb5',
  '#5DD4F0',
  '#02A38A',
  '#E78625',
  '#E0529E',
  '#757AF0',
];
// const regionColors = UNDPColorModule.categoricalColors.colors;
const regionScale = scaleOrdinal<string>()
  .domain(regionsOptions)
  .range(regionColors);
export function ScatterPlotGlobal(props: Props) {
  const { data } = props;
  const graphWidth = 1280;
  const graphHeight = 550;
  const margin = { top: 20, right: 30, bottom: 50, left: 80 };
  const [hoverData, setHoverData] = useState<HoverDataType | undefined>(
    undefined,
  );
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [hoverValue, setHoverValue] = useState<string>('');
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - margin.left - margin.right])
    .nice();
  const yPos = scaleLinear()
    .domain([70, 0])
    .range([0, graphHeight - margin.top - margin.bottom]);
  const yAxis = axisLeft(yPos as any)
    .tickSize(-graphWidth + margin.left + margin.right)
    .tickFormat((d: any) => `${d}%`);
  const xAxis = axisBottom(xPos)
    .tickSize(0)
    .tickSizeOuter(0)
    .tickPadding(6)
    .tickFormat((d: any) => `${d}%`);
  // eslint-disable-next-line no-console
  useEffect(() => {
    const svg = select('#scatterGlobal');
    svg.select('.yAxis').call(yAxis as any);
    svg.select('.xAxis').call(xAxis as any);
    svg.selectAll('.domain').remove();
    svg
      .selectAll('.yAxis text')
      .attr('dy', '-4px')
      .attr('x', '-4px')
      .attr('text-anchor', 'end');
  }, []);

  return (
    <div className='chart-container margin-top-06'>
      <h6 className='undp-typography'>Headcount ratio vs Intensity</h6>
      <div className='margin-left-08 margin-bottom-03'>
        <Radio.Group
          defaultValue='All'
          onChange={(el: RadioChangeEvent) =>
            setSelectedRegion(el.target.value)
          }
          className='margin-bottom-05'
        >
          <Radio.Button className='radio-button' value='All'>
            All
          </Radio.Button>
          {regionsOptions.map((d, i) => (
            <Radio.Button
              key={i}
              className='radio-button'
              value={d}
              style={{
                borderBottom: `4px solid ${regionScale(d)}`,
              }}
            >
              {d}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} id='scatterGlobal'>
        <g transform={`translate(${margin.left},${margin.top})`}>
          <g
            className='xAxis'
            transform={`translate(0 ,${
              graphHeight - margin.bottom - margin.top
            })`}
          />
          <g className='yAxis' transform='translate(0,0)' />
          {data.map((d: any, i: number) => (
            <g
              key={i}
              onMouseEnter={event => {
                setHoverValue(d.country);
                setHoverData({
                  country: d.country,
                  continent: d.region,
                  countryValues: d,
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
                fill={regionScale(d.region)}
                stroke={hoverValue === d.country ? 'var(--gray-700)' : '#FFF'}
                strokeWidth={1}
                visibility={
                  selectedRegion === d.region || selectedRegion === 'All'
                    ? 'visible'
                    : 'hidden'
                }
              />
            </g>
          ))}
        </g>
        <text x={graphWidth / 2} y={graphHeight - 3} textAnchor='middle'>
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
      {hoverData ? <Tooltip data={hoverData} prop='mpi' /> : null}
    </div>
  );
}
