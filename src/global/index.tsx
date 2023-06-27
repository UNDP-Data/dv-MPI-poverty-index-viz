import { Map } from '../Choropleth/Map';
import { DumbellChartViz } from '../DumbellChartViz';
import { MpiDataType, MpiDataTypeUrbanRural } from '../Types';

interface Props {
  mpiData: MpiDataType[];
  urbanRuralData: MpiDataTypeUrbanRural[];
}
export function Global(props: Props) {
  const { mpiData, urbanRuralData } = props;
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
        <h3>Difference in MPI between urban and rural areas</h3>
        {urbanRuralData ? <DumbellChartViz data={urbanRuralData} /> : null}
      </div>
    </div>
  );
}
