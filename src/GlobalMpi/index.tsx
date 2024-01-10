import UNDPColorModule from 'undp-viz-colors';
import { Map } from '../Components/Choropleth/Map';
import { DumbellChartViz } from './DumbellChartViz';
import { MpiDataType, MpiDataTypeDiff } from '../Types';
import { ScatterPlotGlobal } from './ScatterPlotGlobal';

interface Props {
  mpiData: MpiDataType[];
  diffData: MpiDataTypeDiff[];
}
export function GlobalMpi(props: Props) {
  const { mpiData, diffData } = props;
  return (
    <div>
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
      >
        <h3 className='undp-typography margin-bottom-08'>
          Global Multidimensional Poverty Index (MPI)
        </h3>
      </div>
      {mpiData ? (
        <div className='flex-div flex-wrap gap-04'>
          <div className='chart-left-div'>
            <p className='undp-typography margin-bottom-07'>
              The global Multidimensional Poverty Index (MPI) is an inclusive
              measure that complements monetary poverty assessments by capturing
              deprivations in health, education, and living standards. It
              identifies individuals as poor if poor if they are deprived in
              one-third or more of the ten weighted indicators, measuring the
              intensity of their poverty based on the percentage of
              deprivations. The MPI provides insights into who is poor and how
              they experience poverty, offering a comprehensive understanding of
              poverty dynamics. It allows for comparisons across various
              administrative levels and reveals how different groups and
              countries experience experience poverty through the composition of
              indicators.
            </p>
          </div>
          <Map
            data={mpiData}
            prop='mpi'
            valueArray={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]}
            colors={UNDPColorModule.sequentialColors.negativeColorsx07}
          />
        </div>
      ) : null}
      <div>
        <ScatterPlotGlobal data={mpiData} />
      </div>
      <div className='margin-top-09'>
        <h3>
          Comparisons: Urban vs Rural and Female vs Male headed households
        </h3>
        {diffData ? <DumbellChartViz data={diffData} /> : null}
      </div>
    </div>
  );
}
