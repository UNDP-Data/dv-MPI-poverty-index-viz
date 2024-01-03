/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { MpiDataType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: MpiDataType[];
}

export function BarChart(props: Props) {
  const { data } = props;
  console.log('data bar chart', data);
  const options = [
    { value: 'mpi', name: 'MPI' },
    { value: 'headcountRatio', name: 'Headcount Ratio' },
  ];
  const [radioSelection, setRadioSelection] = useState(options[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number | 500>(500);
  const [divHeight, setDivHeight] = useState<number | 500>(500);
  useEffect(() => {
    if (containerRef.current) {
      setDivWidth(containerRef.current.clientWidth);
      setDivHeight(containerRef.current.clientHeight);
    }
  }, [data]);
  return (
    <>
      <div className='margin-bottom-03'>
        <div>
          <p className='undp-typography small-font margin-bottom-01'>
            Years: {data[data.length - 1].year} - {data[0].year}
          </p>
        </div>
        <div className='flex-div flex-space-between flex-wrap'>
          <div>
            <Radio.Group
              defaultValue='mpi'
              onChange={(el: RadioChangeEvent) => {
                setRadioSelection(
                  options.filter(d => d.value === el.target.value)[0],
                );
              }}
            >
              {options.map((d, i) => (
                <Radio key={i} className='undp-radio' value={d.value}>
                  {d.name}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        </div>
      </div>
      <div ref={containerRef}>
        <Graph
          data={data}
          radioOption={radioSelection}
          svgWidth={divWidth}
          svgHeight={divHeight}
        />
      </div>
    </>
  );
}
