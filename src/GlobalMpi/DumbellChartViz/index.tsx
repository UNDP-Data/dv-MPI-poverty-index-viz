/* eslint-disable no-console */
import { useState, useEffect } from 'react';
import { Select, Radio, RadioChangeEvent } from 'antd';
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
  const [indicatorOption, setIndicatorOption] = useState('mpi');
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
      label: 'Difference',
      value: 'diff',
    },
    {
      label: 'Country Name',
      value: 'country',
    },
  ];
  const sortingOptionsLocation = [
    {
      label: 'Urban',
      value: 'mpiUrban',
    },
    {
      label: 'Rural',
      value: 'mpiRural',
    },
  ];
  const sortingOptionsGender = [
    {
      label: 'Female HHs',
      value: 'mpiFemale',
    },
    {
      label: 'Male HHs',
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
        <div>
          <span className='label undp-typography'>
            Select an indicator: &nbsp;&nbsp;&nbsp;
          </span>
          <Radio.Group
            defaultValue='mpi'
            onChange={(el: RadioChangeEvent) =>
              setIndicatorOption(el.target.value)
            }
            className='margin-bottom-05'
          >
            <Radio className='undp-radio' value='mpi'>
              MPI
            </Radio>
            <Radio className='undp-radio' value='headcountR'>
              Incidence (%)
            </Radio>
            <Radio className='undp-radio' value='intensity'>
              Intensity (%)
            </Radio>
          </Radio.Group>
        </div>
        <div className='flex-div flex-wrap'>
          <div className='dumbell-select'>
            <p className='label undp-typography'>Display differences between</p>
            <Select
              options={diffOptions}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => setDiffOption(el)}
              value={diffOption}
            />
          </div>
          <div className='dumbell-select'>
            <p className='label undp-typography'>sorted by</p>
            <Select
              options={sortingOptions}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => setSortedBy(el)}
              value={sortedBy}
            />
          </div>
          <div className='dumbell-select'>
            <p className='label undp-typography'>filtered by region</p>
            <Select
              options={regionsOptions.map(region => ({
                label: region,
                value: region,
              }))}
              className='undp-select'
              style={{ width: '100%' }}
              onChange={el => setFilterBy(el)}
              value={filterBy}
            />
          </div>
        </div>
        <div
          className='flex-div margin-top-05'
          style={{ alignItems: 'center' }}
        >
          <div style={{ width: '27%' }} className='dumbell-titles'>
            Countries
          </div>
          <div style={{ width: '150px' }} className='dumbell-titles'>
            {' '}
          </div>
          <div
            className='legend-container dumbel-titles'
            style={{ width: '260px' }}
          >
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
            style={{ right: '10px', position: 'absolute' }}
            className='dumbell-titles'
          >
            Year survey
          </div>
        </div>
      </div>
      <DumbellChartEl className='undp-scrollbar'>
        <DumbellChart
          data={data}
          diffOption={diffOption}
          sortedByKey={sortedBy}
          filterByLabel={filterBy}
          indicatorOption={indicatorOption}
        />
      </DumbellChartEl>
    </div>
  );
}
