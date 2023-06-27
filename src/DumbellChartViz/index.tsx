import { useState } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeDiff } from '../Types';
import { DumbellChart } from './DumbellChart';

interface Props {
  data: MpiDataTypeDiff[];
}

const DumbellChartEl = styled.div`
  height: 60rem;
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
  // eslint-disable-next-line no-console

  const diffOptions = [
    {
      label: 'male - female',
      value: 'gdiff',
    },
    {
      label: 'urban - rural',
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
  ];
  return (
    <div className='dumbell-container'>
      <div className='dumbell-header'>
        <div className='flex-div'>
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>display differences between</div>
            <div>
              <Select
                options={diffOptions}
                className='undp-select'
                style={{ width: '200px' }}
                onChange={el => setDiffOption(el)}
                value={diffOption}
              />
            </div>
          </div>
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>sort by</div>
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
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>filter by</div>
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
          style={{ alignItems: 'bottom' }}
        >
          <div style={{ width: '220px' }}>Countries</div>
          <div style={{ width: '600px' }}>Difference rural - urban </div>
          <div className='legend-container'>
            <div className='legend-item'>
              <div
                className='legend-circle'
                style={{
                  backgroundColor:
                    UNDPColorModule.categoricalColors.locationColors.urban,
                }}
              />
              <div>Urban</div>
            </div>
            <div className='legend-item'>
              <div
                className='legend-circle'
                style={{
                  backgroundColor:
                    UNDPColorModule.categoricalColors.locationColors.rural,
                }}
              />
              <div>Rural</div>
            </div>
          </div>
        </div>
      </div>
      <DumbellChartEl>
        <DumbellChart
          data={data}
          sortedByKey={sortedBy}
          filterByLabel={filterBy}
        />
      </DumbellChartEl>
    </div>
  );
}
