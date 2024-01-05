/* eslint-disable no-console */
import { useRef, useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import { MpiDataType } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: MpiDataType[];
  indicator: string;
}

export function BarChart(props: Props) {
  const { data, indicator } = props;
  const options = [
    { value: 'mpi', name: 'MPI' },
    { value: 'headcountRatio', name: 'Headcount Ratio' },
  ];
  const [radioSelection, setRadioSelection] = useState(options[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <>
      <div className='margin-bottom-03'>
        <div>
          <p className='undp-typography small-font margin-bottom-02'>
            Years: {data[data.length - 1].year} - {data[0].year}
          </p>
        </div>
        {indicator !== 'headcountRatio' ? (
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
        ) : (
          <div>
            <h6>Headcount ratio</h6>
          </div>
        )}
      </div>
      <div ref={containerRef}>
        <Graph
          data={data}
          radioOption={
            indicator === 'headcountRatio' ? options[1] : radioSelection
          }
          svgWidth={400}
          svgHeight={400}
        />
      </div>
    </>
  );
}
