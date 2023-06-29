import { useState, useEffect } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeDiff } from '../Types';
import { DumbellChart } from './DumbellChart';

interface Props {
  data: MpiDataTypeDiff[];
}

const DumbellChartEl = styled.div`
  height: ${window.innerHeight - 200}px;
  background-color: var(--black-100);
  box-shadow: var(--shadow);
  padding: 1rem;
  border-radius: 2px;
  overflow: auto;
`;
export function DumbellChartViz(props: Props) {
  const { data } = props;
  const [sortedBy, setSortedBy] = useState('diff');
  const [filterBy, setFilterBy] = useState('All');
  const [diffOption, setDiffOption] = useState('ldiff');
  const [color1, setColor1] = useState(
    UNDPColorModule.categoricalColors.locationColors.urban,
  );
  const [color2, setColor2] = useState(
    UNDPColorModule.categoricalColors.locationColors.rural,
  );

  const diffOptions = [
    {
      label: 'Female - Male',
      value: 'gdiff',
    },
    {
      label: 'Rural - Urban',
      value: 'ldiff',
    },
  ];
  const regionsOptions = [
    'All',
    'Arab States',
    'East Asia and the Pacific',
    'Europe and Central Asia',
    'Latin America and the Caribbean',
    'South Asia',
    'Sub-Saharan Africa',
  ];
  const sortingOptions = [
    {
      label: 'MPI difference',
      value: 'diff',
    },
    {
      label: 'Country Name',
      value: 'country',
    },
    {
      label: 'Urban MPI',
      value: 'mpiUrban',
    },
    {
      label: 'Rural MPI',
      value: 'mpiRural',
    },
    {
      label: 'Female MPI',
      value: 'mpiFemale',
    },
    {
      label: 'Male MPI',
      value: 'mpiMale',
    },
  ];
  useEffect(() => {
    if (diffOption === 'ldiff') {
      setColor1(UNDPColorModule.categoricalColors.locationColors.urban);
      setColor2(UNDPColorModule.categoricalColors.locationColors.rural);
    } else {
      setColor1(UNDPColorModule.categoricalColors.genderColors.male);
      setColor2(UNDPColorModule.categoricalColors.genderColors.female);
    }
  }, [diffOption]);
  return (
    <div className='dumbell-container'>
      <div className='dumbell-header'>
        <div className='flex-div'>
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>Display differences between</div>
            <div>
              <Select
                options={diffOptions}
                className='undp-select'
                style={{ width: '200px' }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={el => setDiffOption(el)}
                value={diffOption}
              />
            </div>
          </div>
          <div
            className='flex-div margin-left-04'
            style={{ alignItems: 'center' }}
          >
            <div>sorted by</div>
            <div>
              <Select
                options={sortingOptions}
                className='undp-select'
                style={{ width: '200px' }}
                onChange={el => setSortedBy(el)}
                value={sortedBy}
              />
            </div>
          </div>
          <div
            className='flex-div margin-left-04'
            style={{ alignItems: 'center' }}
          >
            <div>filtered by</div>
            <div>
              <Select
                options={regionsOptions.map(region => ({
                  label: region,
                  value: region,
                }))}
                className='undp-select'
                style={{ width: '200px' }}
                onChange={el => setFilterBy(el)}
                value={filterBy}
              />
            </div>
          </div>
        </div>
        <div
          className='flex-div margin-top-05'
          style={{ alignItems: 'center' }}
        >
          <div style={{ width: '220px', fontWeight: '700' }}>Countries</div>
          <div style={{ width: '600px', fontWeight: '700' }}>
            Difference{' '}
            {diffOptions.filter(d => d.value === diffOption)[0].label}{' '}
          </div>
          <div className='legend-container'>
            <div className='legend-item'>
              <div
                className='legend-circle'
                style={{
                  backgroundColor: color1,
                }}
              />
              <div>{diffOption === 'ldiff' ? 'Urban' : 'Male'}</div>
            </div>
            <div className='legend-item'>
              <div
                className='legend-circle'
                style={{
                  backgroundColor: color2,
                }}
              />
              <div>{diffOption === 'ldiff' ? 'Rural' : 'Female'}</div>
            </div>
          </div>
        </div>
      </div>
      <DumbellChartEl>
        <DumbellChart
          data={data}
          diffOption={diffOption}
          sortedByKey={sortedBy}
          filterByLabel={filterBy}
        />
      </DumbellChartEl>
    </div>
  );
}
