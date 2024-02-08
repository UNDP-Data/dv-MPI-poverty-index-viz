/* eslint-disable no-console */
import { MpiDataType } from '../../Types';
import { Chart } from './Chart';

interface Props {
  data: MpiDataType[];
}

export function DumbellChartHorizontal(props: Props) {
  const { data } = props;
  return (
    <div
      className='chart-container undp-scrollbar'
      style={{ overflow: 'auto' }}
    >
      <h6 className='undp-typography margin-bottom-00'>
        Multidimensional poverty vs extreme poverty incidence
      </h6>
      <Chart data={data} />
      <p className='source'>
        Source:{' '}
        <a
          target='_blank'
          rel='noreferrer'
          className='undp-style small-font'
          href='https://ophi.org.uk/multidimensional-poverty-index/data-tables-do-files/'
        >
          Global MPI data tables 2023, Table 1: National Results
        </a>
        <br />
        Note: Extreme monetary poverty refers to the World Bank indicator
        monetary poverty headcount ratio at PPP $2.15 a day
      </p>
    </div>
  );
}
