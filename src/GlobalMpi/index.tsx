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
    <div>
      <h3 className='undp-typography'>
        Global Multidimensional Poverty Index (MPI)
      </h3>
      <p className='undp-typography'>
        The global Multidimensional Poverty Index (MPI) is an inclusive measure
        that complements monetary poverty assessments by capturing deprivations
        in health, education, and living standards. It identifies individuals as
        poor if they are deprived in one-third or more of the ten weighted
        indicators, measuring the intensity of their poverty based on the
        percentage of deprivations. The MPI provides insights into who is poor
        and how they experience poverty, offering a comprehensive understanding
        of poverty dynamics. It allows for comparisons across various
        administrative levels and reveals how different groups and countries
        experience poverty through the composition of the MPI indicators.
      </p>
      {mpiData ? (
        <div>
          <Map data={mpiData} />
        </div>
      ) : null}
      <div className='margin-top-06'>
        <h5 className='undp-typography'>Key Definitions</h5>
        <div className='flex-div flex-wrap'>
          <div className='definitionDiv'>
            <h6 className='undp-typography'>
              Multidimensional Poverty Index (MPI)
            </h6>
            <p className='undp-typography small-font'>
              Multidimensional Poverty Index is calculated as the product of the
              headcount ratio and the intensity of poverty. It combines both
              measures to provide a comprehensive assessment of multidimensional
              poverty, taking into account both the prevalence and severity of
              poverty among individuals in a population.
            </p>
          </div>
          <div className='definitionDiv'>
            <h6 className='undp-typography'>Headcount Ratio</h6>
            <p className='undp-typography small-font'>
              The headcount ratio measures the percentage of individuals in a
              population who are considered multidimensionally poor, indicating
              the proportion of people experiencing poverty across multiple
              dimensions.
            </p>
          </div>
          <div className='definitionDiv'>
            <h6 className='undp-typography'>Intensity of poverty</h6>
            <p className='undp-typography small-font'>
              The intensity of poverty is the average proportion of weighted
              indicators in which multidimensionally poor individuals are
              deprived. It provides insights into the extent or severity of
              deprivation experienced by those classified as multidimensionally
              poor.
            </p>
          </div>
        </div>
      </div>
      <div className='margin-top-09'>
        <h3>Differences in MPI</h3>
        {diffData ? <DumbellChartViz data={diffData} /> : null}
      </div>
    </div>
  );
}
