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
              The global Multidimensional Poverty Index (MPI) measures
              multidimensional poverty in over 100 developing countries, using
              internationally comparable datasets and is updated annually. The
              measure captures the severe deprivations that each person faces at
              the same time using information from 10 indicators, which are
              grouped into three equally weighted dimensions: health, education,
              and living standards. It identifies individuals as poor if they
              are deprived in one-third or more of these indicators, measuring
              the intensity of their poverty based on the percentage of
              deprivations. The MPI provides insights into who is poor and how
              how they experience poverty, offering a comprehensive
              understanding of poverty dynamics. It allows for comparisons
              across various administrative levels and reveals how different
              groups and countries experience poverty through the composition of
              indicators.
            </p>
            <p className='undp-typography'>
              According to the latest global MPI data, 1.1 billion people (out
              of 6.1 billion across 110 countries) are still living in acute
              multidimensional poverty. Almost two-third of the MPI poor (730
              million) live in middle-income countries (MICs). However, poverty
              disproportionately affect people in low-income countries (LICs),
              which make up only 10 percent of the population covered by the
              global MPI, but are home to 34.7 percent (387 million) of the
              poor.
            </p>
          </div>
          <div className='chart-global-container'>
            <Map
              data={mpiData}
              prop='mpi'
              valueArray={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]}
              colors={UNDPColorModule.sequentialColors.negativeColorsx07}
            />
          </div>
        </div>
      ) : null}
      <div className='flex-div gap-06'>
        <div className='chart-global-scatter'>
          <ScatterPlotGlobal data={mpiData} />
        </div>
        <div className='margin-top-06 description-scatter'>
          <p className='undp-typography'>
            Global MPI data shows that worrisomely, the higher the incidence of
            poverty, the higher the intensity of poverty that poor people tend
            to experience. In Chad, Niger, South Sudan, the incidence of poverty
            exceeds 80% while on average, the poor are deprived in more than 60%
            of the weighted MPI indicators.
          </p>
        </div>
      </div>
      <div className='margin-top-09'>
        <h3>
          Comparisons: Urban vs Rural and Female vs Male headed households
        </h3>
        <p className='undp-typography'>
          Globally 84% of all MPI poor people living in rural areas. Overall,{' '}
          multidimensional poverty tend to be both more prevalent and more
          intense in rural areas compared to urban areas.
        </p>
        {diffData ? <DumbellChartViz data={diffData} /> : null}
      </div>
      <p className='source'>
        Sources:{' '}
        <a
          target='_blank'
          rel='noreferrer'
          className='undp-style small-font'
          href='https://ophi.org.uk/multidimensional-poverty-index/data-tables-do-files/'
        >
          Global MPI data tables
        </a>
      </p>
    </div>
  );
}
