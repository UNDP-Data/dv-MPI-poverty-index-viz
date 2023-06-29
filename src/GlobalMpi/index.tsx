import { Map } from '../Choropleth/Map';
import { DumbellChartViz } from '../DumbellChartViz';
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
        <h2>Global Multidimensional Poverty Index (MPI)</h2>
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
