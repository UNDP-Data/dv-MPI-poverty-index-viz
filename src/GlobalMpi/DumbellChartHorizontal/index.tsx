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
          href='https://hdr.undp.org/content/2023-global-multidimensional-poverty-index-mpi#/indicies/MPI'
        >
          UNDP (United Nations Development Programme). 2023.
          <br />
          2023 Global Multidimensional Poverty Index (MPI): Unstacking global
          poverty: Data for high impact action. New York.
        </a>
        <br />
        <a
          target='_blank'
          rel='noreferrer'
          className='undp-style small-font'
          href='https://hdr.undp.org/sites/default/files/publications/additional-files/2023-07/2023_GlobalMPI_Table_1_and_2_10July%202023.xlsx'
        >
          2023 MPI Tables 1 and 2 (XLS)
        </a>
        <br />
        Note: Extreme monetary poverty refers to the World Bank indicator
        monetary poverty headcount ratio at PPP $2.15 a day
        <br />
      </p>
    </div>
  );
}
