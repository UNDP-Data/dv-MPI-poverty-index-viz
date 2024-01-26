/* eslint-disable no-console */
import styled from 'styled-components';
import { MpiDataType } from '../../Types';
import { Chart } from './Chart';

interface Props {
  data: MpiDataType[];
}

const DumbellChartEl = styled.div`
  background-color: var(--black-100);
  box-shadow: var(--shadow);
  padding: 1rem;
  border-radius: 2px;
  overflow: auto;
`;
export function DumbellChartHorizontal(props: Props) {
  const { data } = props;

  return (
    <div className='dumbell-container'>
      <DumbellChartEl className='undp-scrollbar'>
        <Chart data={data} />
      </DumbellChartEl>
    </div>
  );
}
