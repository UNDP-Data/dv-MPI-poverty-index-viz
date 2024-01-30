/* eslint-disable @typescript-eslint/no-explicit-any */
import { Radio, RadioChangeEvent } from 'antd';
import { useState } from 'react';
import UNDPColorModule from 'undp-viz-colors';
import { Map } from './Map';

interface Props {
  data: object[];
}
const radioOptions = [
  { label: 'Year of implementation', value: 'yearImplementation' },
  { label: 'Number of measurements', value: 'measurements' },
];

const periodColors = UNDPColorModule.sequentialColors;
export function ChoroplethNational(props: Props) {
  const [optionSelected, setOptionSelected] = useState(radioOptions[0]);
  const { data } = props;
  return (
    <div className='map-container'>
      <div className='flex-div flex-space-between flex-wrap'>
        <div>
          <h6 className='undp-typography margin-bottom-01 margin-top-03'>
            Implementation of Global Multidimensional Poverty index
          </h6>
        </div>
        <div>
          <Radio.Group
            defaultValue={radioOptions[0]}
            onChange={(el: RadioChangeEvent) =>
              setOptionSelected(el.target.value)
            }
          >
            {radioOptions.map((d, i) => (
              <Radio key={i} className='undp-radio' value={d}>
                {d.label}
              </Radio>
            ))}
          </Radio.Group>
        </div>
      </div>
      <Map data={data} prop={optionSelected.value} colors={periodColors} />
      <p className='source undp-typography'>
        Sources: Year of implementation:{' '}
        <a
          className='undp-style small-font'
          href='https://www.mppn.org/applications/national-measures/'
          target='_blank'
          rel='noreferrer'
        >
          Some national measures (MPPN)
        </a>
        . Number of measurements: country reports (available below)
      </p>
    </div>
  );
}
