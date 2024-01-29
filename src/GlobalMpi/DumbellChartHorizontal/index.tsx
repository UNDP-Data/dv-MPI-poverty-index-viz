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
      <Chart data={data} />
      <p className='source'>
        Source:{' '}
        <a
          className='undp-style'
          href='https://hdr.undp.org/content/2023-global-multidimensional-poverty-index-mpi#/indicies/MPI'
        >
          Global Multidimensional Poverty index 2023 MPI Tables 1 and 2
        </a>
      </p>
    </div>
  );
}
