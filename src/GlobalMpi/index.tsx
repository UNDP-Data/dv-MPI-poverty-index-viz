import UNDPColorModule from 'undp-viz-colors';
import { Map } from '../Components/Choropleth/Map';
import { DumbellChartViz } from './DumbellChartViz';
import { DumbellChartHorizontal } from './DumbellChartHorizontal';
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
      <hr className='undp-style light margin-bottom-06' />
      <div
        className='margin-bottom-08'
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <h4 className='undp-typography'>
          Multidimensional Poverty vs Income Poverty
        </h4>
        <p className='undp-typography'>
          Poverty measures that only consider income can underestimate poverty.
          In many countries (42 out of the 61 analyzed in the Global MPI report
          2023), the incidence of multidimensional poverty is higher than the
          incidence of monetary policy (according to the World Bank measure at
          $2.15 per day). In Chad, Guinea and Mali, it is 50 percentage points
          higher.
        </p>
      </div>
      <DumbellChartHorizontal data={mpiData} />
      <div
        className='margin-bottom-08'
        style={{
          maxWidth: '1024px',
          margin: '0 auto',
          padding: '0 1.5rem',
        }}
      >
        <h4 className='undp-typography margin-top-10 margin-bottom-08'>
          The dimensions, indicators, deprivation cutoffs, and weights of the
          global Multidimensional Poverty Index
        </h4>
        <div>
          <div className='flex-div undp-table-head' style={{ padding: '10px' }}>
            <div style={{ width: '15%', textAlign: 'center' }}>
              Dimensions of Poverty
            </div>
            <div style={{ width: '20%', textAlign: 'center' }}>Indicator</div>
            <div style={{ width: '50%', textAlign: 'center' }}>
              Deprived if living in the household where…
            </div>
            <div style={{ width: '10%', textAlign: 'center' }}>Weight</div>
          </div>
          <div className='flex-div color-1'>
            <div className='column-1'>Health</div>
            <div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Nutrition</div>
                <div className='column-3'>
                  Any adult under 70 years of age or any child for whom there is
                  nutritional information is undernourished.
                </div>
                <div className='column-4'>1/6</div>
              </div>
              <div className='flex-div'>
                <div className='column-2'>Child mortality</div>
                <div className='column-3'>
                  Any child under the age of 18 years has died in the family in
                  the five-year period preceding the survey.
                </div>
                <div className='column-4'>1/6</div>
              </div>
            </div>
          </div>
          <div className='flex-div color-2'>
            <div className='column-1'>Education</div>
            <div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Years of schooling</div>
                <div className='column-3'>
                  No household member aged ‘school entrance age + six years or
                  older has completed at least six years of schooling.
                </div>
                <div className='column-4'>1/6</div>
              </div>
              <div className='flex-div'>
                <div className='column-2'>School attendance</div>
                <div className='column-3'>
                  Any school-aged child is not attending school up to the age at
                  which he/she would complete class eight.
                </div>
                <div className='column-4'>1/6</div>
              </div>
            </div>
          </div>
          <div className='flex-div color-3'>
            <div className='column-1'>Standard of living</div>
            <div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Cooking Fuel</div>
                <div className='column-3'>
                  The household cooks with dung, wood, charcoal or coal.
                </div>
                <div className='column-4'>1/18</div>
              </div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Sanitation</div>
                <div className='column-3'>
                  The household’s sanitation facility is not improved (according
                  to SDG guidelines) or it is improved but shared with other
                  households.
                </div>
                <div className='column-4'>1/18</div>
              </div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Drinking Water</div>
                <div className='column-3'>
                  The household does not have access to improved drinking water
                  (according to SDG guidelines) or improved drinking water is at
                  least a 30-minute walk from home, round trip.
                </div>
                <div className='column-4'>1/18</div>
              </div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Electricity</div>
                <div className='column-3'>
                  The household has no electricity.
                </div>
                <div className='column-4'>1/18</div>
              </div>
              <div
                className='flex-div'
                style={{ borderBottom: '2px solid #FFF' }}
              >
                <div className='column-2'>Housing</div>
                <div className='column-3'>
                  At least one of the three housing materials for roof, walls
                  and floor are inadequate: the floor is of natural materials
                  roof and/or walls are of natural or rudimentary materials.
                </div>
                <div className='column-4'>1/18</div>
              </div>
              <div className='flex-div'>
                <div className='column-2'>Assets</div>
                <div className='column-3'>
                  The household does not own more than one of these assets:
                  radio, television, telephone, computer, animal cart, bicycle,
                  or refrigerator, and does not own a car or truck.
                </div>
                <div className='column-4'>1/18</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h4>
        <i>
          To be added here: chart showing indicators values for all countries
        </i>
      </h4>
      <h4 className='undp-typography margin-top-10'>
        Headcount Ratio vs Intensity
      </h4>
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
        <h4 className='undp-typography'>
          Comparing Urban vs Rural and Female vs Male headed households
        </h4>
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
