import UNDPColorModule from 'undp-viz-colors';
import { DumbellChartViz } from './DumbellChartViz';
import { DumbellChartHorizontal } from './DumbellChartHorizontal';
import { MpiDataType, MpiDataTypeDiff } from '../Types';
import { ScatterPlotGlobal } from './ScatterPlotGlobal';
import { IconsMap } from './IconsMap';
import ImageDownloadButton from '../Components/ImageDownloadButton';

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
        <h2 className='undp-typography margin-bottom-08'>
          Global Multidimensional Poverty Index (MPI)
        </h2>
        <p className='undp-typography margin-bottom-07'>
          The global Multidimensional Poverty Index (MPI) measures
          multidimensional poverty in over 100 developing countries, using
          internationally comparable datasets and is updated annually. The
          measure captures the severe deprivations that each person faces at the
          same time using information from 10 indicators, which are grouped into
          three equally weighted dimensions: <strong>health</strong>,{' '}
          <strong>education</strong>, and <strong>living standards</strong>. It
          identifies individuals as poor if they are deprived in one-third or
          more of these indicators and measures the intensity of their poverty
          based on the percentage of the indicators in which they are deprived.
          The MPI provides insights into who is poor and how they experience
          poverty, offering a comprehensive understanding of poverty dynamics.
          It allows for comparisons across various administrative levels and
          reveals how different groups and countries experience poverty through
          the range of indicators.
        </p>
        <h3 className='undp-typography margin-top-08 margin-bottom-08'>
          Dimensions, indicators, deprivation cutoffs, and weights
        </h3>
        <div>
          <div className='flex-div undp-table-head' style={{ padding: '10px' }}>
            <div style={{ width: '20%' }}>Dimensions of Poverty</div>
            <div style={{ width: '20%' }}>Indicator</div>
            <div style={{ width: '50%' }}>
              Deprived if living in the household where…
            </div>
            <div style={{ width: '10%' }}>Weight</div>
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
        <p className='source margin-top-06'>
          Source:{' '}
          <a
            target='_blank'
            rel='noreferrer'
            className='undp-style small-font'
            href='https://hdr.undp.org/content/2023-global-multidimensional-poverty-index-mpi#/indicies/MPI'
          >
            2023 Global Multidimensional Poverty Index (MPI), Annex: The
            dimensions, indicators, deprivation cutoffs, and weights of the
            global Multidimensional Poverty Index,
          </a>{' '}
        </p>
      </div>
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
      >
        <h3 className='undp-typography margin-top-10 margin-bottom-08'>
          Global MPI around the world
        </h3>
      </div>
      {mpiData ? (
        <div>
          <div className='chart-left-div'>
            <p className='undp-typography'>
              According to the latest global MPI data, 1.1 billion people (out
              of 6.1 billion across 110 countries) are still living in acute
              multidimensional poverty. Almost two-thirds of the
              multidimensionally poor (730 million) people live in middle-income
              countries (MICs). However, poverty disproportionately affects
              people in low-income countries
            </p>
            <p className='undp-typography'>
              (LICs), which make up only 10 percent of the population covered by
              the global MPI, but are home to 34.7 percent (387 million) of the
              multidimensionally poor. Moreover, five out of six poor people
              live in Sub-Saharan Africa (47.8 percent) or South Asia (34.9
              percent).
            </p>
            <p className='undp-typography'>
              However, the latest MPI data shows that poverty reduction is
              possible, as in the last 15 years, twenty-five countries halved
              their Global MPI value. In 79 of the 81 countries with trend data,
              MPI had decreased between countries’ first and last measurements.
            </p>
          </div>
          <div>
            <IconsMap
              data={mpiData}
              prop='mpi'
              valueArray={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]}
              colors={UNDPColorModule.sequentialColors.negativeColorsx07}
            />
            <div className='flex-div flex-space-between flex-wrap'>
              <div style={{ flexBasis: '60%', flexGrow: '1' }}>
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
                    2023 Global Multidimensional Poverty Index (MPI): Unstacking
                    global poverty: Data for high impact action. New York.
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
                  Note: The absolute annualized change is the difference in a
                  poverty measure between two years, divided by the number of
                  years between surveys. The values presented in the map have
                  calculated using measurements of the first and last available
                  year.
                </p>
              </div>
              <div>
                <ImageDownloadButton
                  node={
                    document.getElementById('povertyChangeMap') as HTMLElement
                  }
                  buttonText='Download map'
                  filename='multidimensionalPovertyChange'
                  buttonType='secondary'
                />
              </div>
            </div>
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
        <h3 className='undp-typography margin-top-08 margin-bottom-08'>
          Multidimensional Poverty vs Income Poverty
        </h3>
        <p className='undp-typography'>
          Poverty measures that only consider income can underestimate poverty.
          In many countries (more than 40 out of the 61 analyzed in the Global
          MPI report 2023), the incidence of multidimensional poverty is higher
          than the incidence of monetary policy (according to the World Bank
          measure at $2.15 per day). In Chad, Guinea and Mali, it is 50
          percentage points higher.
        </p>
      </div>
      <DumbellChartHorizontal
        data={mpiData.filter(d => d.displayDifference === true)}
      />
      <h3 className='undp-typography margin-top-08'>Incidence vs Intensity</h3>
      <div className='flex-div flex-wrap gap-06 global-scatter-container'>
        <div className='chart-global-scatter'>
          <ScatterPlotGlobal data={mpiData} />
        </div>
        <div className='margin-top-06 description-scatter'>
          <p className='undp-typography'>
            Global MPI data shows that worrisomely, the higher the incidence of
            poverty, the higher the intensity of poverty that poor people tend
            to experience. Multidimensional poverty in Sub-Saharan Africa is
            particularly high. Overall, in 19 of the 40 of the countries with
            data, the reported incidence exceeds 50 percent; moreover, in 18
            countries the poor are deprived in at least half of the MPI
            indicators. In Chad, Niger the incidence of poverty exceeds 80%
            where, on average, the poor are deprived in more than 60% of the
            weighted MPI indicators.
          </p>
        </div>
      </div>
      <div
        style={{ maxWidth: '1024px', margin: '0 auto', padding: '0 1.5rem' }}
      >
        <h3 className='undp-typography margin-top-10 margin-bottom-08'>
          Comparing Urban vs Rural and Female vs Male headed households
        </h3>
        <p className='undp-typography'>
          Globally 84% of all MPI poor people living in rural areas. Overall,{' '}
          multidimensional poverty tend to be both more prevalent and more
          intense in rural areas compared to urban areas.
        </p>
        <p>
          In a number of countries, people living in female-headed households
          are significantly poorer than those living male-headed households.
          This is so for instance in Malawi, Liberia, Namibia, where the gender
          gap in the incidence of poverty exceeds 8 percentage points. But the
          opposite is also true for other countries such as the Gambia, Senegal,
          Nigeria, where male-headed households are poorer. However, measuring
          poverty at household level alone does not allow to capture the extent
          to which women, men, boys and girls experience poverty differently
          within the same household. As a way forward, one can index eligible
          persons within each household to analyze ‘individual indicators’ (e.g.
          years of schooling, nutrition, school attendance) by gender, as was
          done in the Global MPI report 2021{' '}
          <a
            target='_blank'
            rel='noreferrer'
            className='undp-style'
            href='https://hdr.undp.org/content/2021-global-multidimensional-poverty-index-mpi'
          >
            (2021 Global Multidimensional Poverty Index (MPI): Unmasking
            disparities by ethnicity, caste and gender.)
          </a>
        </p>
      </div>
      <div className='margin-top-09'>
        {diffData ? <DumbellChartViz data={diffData} /> : null}
      </div>
    </div>
  );
}
