import { useState, useEffect } from 'react';
import { Select } from 'antd';
import styled from 'styled-components';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeDiff } from '../../Types';
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
      label: 'Rural - Urban',
      value: 'ldiff',
    },
    {
      label: 'Female - Male Headed Households (HHS)',
      value: 'gdiff',
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
  const sortingOptionsBasic = [
    {
      label: 'MPI difference',
      value: 'diff',
    },
    {
      label: 'Country Name',
      value: 'country',
    },
  ];
  const sortingOptionsLocation = [
    {
      label: 'Urban MPI',
      value: 'mpiUrban',
    },
    {
      label: 'Rural MPI',
      value: 'mpiRural',
    },
  ];
  const sortingOptionsGender = [
    {
      label: 'Female HHs MPI',
      value: 'mpiFemale',
    },
    {
      label: 'Male HHs MPI',
      value: 'mpiMale',
    },
  ];
  const [sortingOptions, setSortingOptions] = useState(sortingOptionsBasic);
  useEffect(() => {
    if (diffOption === 'ldiff') {
      setColor1(UNDPColorModule.categoricalColors.locationColors.urban);
      setColor2(UNDPColorModule.categoricalColors.locationColors.rural);
      setSortingOptions(sortingOptionsBasic.concat(sortingOptionsLocation));
    } else {
      setColor1(UNDPColorModule.categoricalColors.genderColors.male);
      setColor2(UNDPColorModule.categoricalColors.genderColors.female);
      setSortingOptions(sortingOptionsBasic.concat(sortingOptionsGender));
    }
  }, [diffOption]);
  return (
    <div className='dumbell-container'>
      <div className='dumbell-header'>
        <div className='flex-div'>
          <div className='flex-div' style={{ alignItems: 'center' }}>
            <div>
              <p className='label undp-typography'>
                Display differences between
              </p>
              <Select
                options={diffOptions}
                className='undp-select'
                style={{ width: '350px' }}
                onChange={el => setDiffOption(el)}
                value={diffOption}
              />
            </div>
          </div>
          <div
            className='flex-div margin-left-04'
            style={{ alignItems: 'center' }}
          >
            <div>
              <p className='label undp-typography'>sorted by</p>
              <Select
                options={sortingOptions}
                className='undp-select'
                style={{ width: '350px' }}
                onChange={el => setSortedBy(el)}
                value={sortedBy}
              />
            </div>
          </div>
          <div
            className='flex-div margin-left-04'
            style={{ alignItems: 'center' }}
          >
            <div>
              <p className='label undp-typography'>filtered by region</p>
              <Select
                options={regionsOptions.map(region => ({
                  label: region,
                  value: region,
                }))}
                className='undp-select'
                style={{ width: '350px' }}
                onChange={el => setFilterBy(el)}
                value={filterBy}
              />
            </div>
          </div>
        </div>
        <div
          className='flex-div margin-top-05 dumbell-titles'
          style={{ alignItems: 'center' }}
        >
          <div style={{ width: '260px', fontWeight: '700' }}>Countries</div>
          <div style={{ width: '90px', fontWeight: '700' }}>Difference </div>
          <div className='legend-container' style={{ width: '260px' }}>
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
          <div
            style={{ fontWeight: '700', right: '100px', position: 'absolute' }}
          >
            Year survey
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
