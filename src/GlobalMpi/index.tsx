import { Map } from './Choropleth/Map';
import { DumbellChartViz } from './DumbellChartViz';
import { MpiDataType, MpiDataTypeDiff } from '../Types';

interface Props {
  mpiData: MpiDataType[];
  diffData: MpiDataTypeDiff[];
}
export function GlobalMpi(props: Props) {
  const { mpiData, diffData } = props;
  return (
    <div style={{ width: '1280px', margin: 'auto' }}>
      <div>
        <h3 className='undp-typography'>
          Global Multidimensional Poverty Index (MPI)
        </h3>
        <p className='undp-typography'>
          The global Multidimensional Poverty Index (MPI) is an inclusive
          measure that complements monetary poverty assessments by capturing
          deprivations in health, education, and living standards. It identifies
          individuals as poor if they are deprived in one-third or more of the
          ten weighted indicators, measuring the intensity of their poverty
          based on the percentage of deprivations. The MPI provides insights
          into who is poor and how they experience poverty, offering a
          comprehensive understanding of poverty dynamics. It allows for
          comparisons across various administrative levels and reveals how
          different groups and countries experience poverty through the
          composition of the MPI indicators.
        </p>
        {mpiData ? (
          <div>
            <Map data={mpiData} />
          </div>
        ) : null}
      </div>
      <div className='margin-top-09'>
        <h3>Differences in MPI</h3>
        {diffData ? <DumbellChartViz data={diffData} /> : null}
      </div>
    </div>
  );
}
