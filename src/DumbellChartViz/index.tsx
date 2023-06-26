// import { useState } from 'react';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeUrbanRural } from '../Types';
// import { CaretDown } from '../icons';
import { DumbellChart } from './DumbellChart';

interface Props {
  data: MpiDataTypeUrbanRural[];
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
  const sortedBy = {
    label: 'Rural - Urban',
    key: 'diff',
  };
  /* const [sortedBy, setSortedBy] = useState({
    label: 'Country Name',
    key: 'country',
  });
  setSortedBy({
    label: 'Country Name',
    key: 'country',
  }); */
  /* const sortingOptions = [
    {
      label: 'Country Name',
      key: 'country',
    },
    {
      label: 'MPI difference',
      key: 'mpi-diff',
    },
    {
      label: 'Rural',
      key: 'rural',
    },
    {
      label: 'Urban',
      key: 'urban',
    },
  ]; */
  return (
    <div className='dumbell-container'>
      <div className='dumbell-header'>
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
        <div className='flex-div'>
          <div style={{ width: '220px' }}>Countries</div>
          <div style={{ width: '600px' }}>Difference rural - urban </div>
          <div>
            <div>sorted by {sortedBy.label}</div>
          </div>
        </div>
      </div>
      <DumbellChartEl>
        <DumbellChart data={data} sortedByKey={sortedBy.key} />
      </DumbellChartEl>
    </div>
  );
}
