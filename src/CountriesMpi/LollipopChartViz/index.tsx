import { useState } from 'react';
import { Radio, RadioChangeEvent } from 'antd';
import styled from 'styled-components';
import { MpiDataTypeSubnational } from '../../Types';
import { LollipopChart } from './LollipopChart';

interface Props {
  data: MpiDataTypeSubnational[];
}

const LollipopChartEl = styled.div`
  height: 600px;
  background-color: var(--black-100);
  box-shadow: var(--shadow);
  padding: 1rem;
  border-radius: 2px;
  overflow: auto;
`;
export function LollipopChartViz(props: Props) {
  const { data } = props;
  const [sortedBy, setSortedBy] = useState('mpi');

  return (
    <div className='lollipop-container'>
      <div className='lollipop-header'>
        <div className='flex-div'>
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>
              <p className='label undp-typography'>Sort by</p>
              <Radio.Group
                defaultValue='mpi'
                onChange={(el: RadioChangeEvent) =>
                  setSortedBy(el.target.value)
                }
                className='margin-bottom-05'
              >
                <Radio className='undp-radio' value='mpi'>
                  MPI
                </Radio>
                <Radio className='undp-radio' value='subregion'>
                  Subregion name
                </Radio>
              </Radio.Group>
            </div>
          </div>
        </div>
        <div
          className='flex-div margin-top-00 lollipop-titles'
          style={{ alignItems: 'center' }}
        >
          <div style={{ width: '230px', fontWeight: '700' }}>Regions</div>
          <div style={{ width: '200px', fontWeight: '700' }}>MPI value</div>
          <div className='legend-container' style={{ width: '320px' }}>
            <div className='legend-item'>
              <div
                className='legend-circle-small'
                style={{
                  backgroundColor: '#FFF',
                  border: '3px solid #59BA47',
                }}
              />
              <div>Intensity</div>
            </div>
            <div className='legend-item'>
              <div
                className='legend-circle-small'
                style={{
                  backgroundColor: '#FFF',
                  border: '3px solid #FBC412',
                }}
              />
              <div>Headcount ratio</div>
            </div>
          </div>
        </div>
      </div>
      <LollipopChartEl>
        <LollipopChart data={data} sortedByKey={sortedBy} />
      </LollipopChartEl>
    </div>
  );
}
