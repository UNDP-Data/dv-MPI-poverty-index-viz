/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styled from 'styled-components';
import { HoverDataType } from '../Types';

interface Props {
  data: HoverDataType;
}

interface TooltipElProps {
  x: number;
  y: number;
  verticalAlignment: string;
  horizontalAlignment: string;
}
const TooltipEl = styled.div<TooltipElProps>`
  display: block;
  position: fixed;
  z-index: 8;
  padding-bottom: 10px;
  background-color: var(--gray-100);
  border: 1px solid var(--gray-300);
  line-height: 1.1;
  word-wrap: break-word;
  top: ${props =>
    props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40}px;
  left: ${props =>
    props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20}px;
  max-width: 24rem;
  min-width: 20rem;
  transform: ${props =>
    `translate(${props.horizontalAlignment === 'left' ? '-100%' : '0%'},${
      props.verticalAlignment === 'top' ? '-100%' : '0%'
    })`};
`;

export function Tooltip(props: Props) {
  const { data } = props;
  return (
    <TooltipEl
      x={data.xPosition}
      y={data.yPosition}
      verticalAlignment={
        data.yPosition > window.innerHeight / 2 ? 'top' : 'bottom'
      }
      horizontalAlignment={
        data.xPosition > window.innerWidth / 2 ? 'left' : 'right'
      }
    >
      <div
        className='flex-div flex-wrap'
        style={{ padding: 'var(--spacing-05)', alignItems: 'baseline' }}
      >
        <h6
          className='undp-typography bold margin-bottom-00'
          style={{ color: 'var(--blue-600)' }}
        >
          {data.country}{' '}
          <span
            className='undp-typography'
            style={{
              color: 'var(--gray-600)',
              fontWeight: 'normal',
              fontSize: '0.875rem',
              textTransform: 'none',
            }}
          >
            {data.continent ? `(${data.continent})` : null}
          </span>
        </h6>
      </div>
      <hr className='undp-style margin-top-00 margin-bottom-00' />
      <div
        style={{
          padding: 'var(--spacing-05)',
        }}
      >
        {Object.keys(data.countryValues).length === 0 &&
        data.countryValues.constructor === Object ? (
          'no data available for this country'
        ) : (data.countryValues as any).countryData.length > 0 ? (
          <>
            <div className='tooltipTitle'>
              Absolute annualized change in headcount ratio:
            </div>
            <div>
              <span className='tooltipValue'>
                {Number(
                  (data.countryValues as any).annualizedChangeHeadcount,
                ).toFixed(3)}{' '}
                {Number((data.countryValues as any).annualizedChangeHeadcount) <
                0
                  ? '(decrease)'
                  : '(increase)'}
              </span>
            </div>
            <hr className='undp-style margin-top-03 margin-bottom-03' />
            <div className='flex-div'>
              <div style={{ width: '50%' }}>
                <div className='tooltipTitle'>MPI</div>
                {(data.countryValues as any).countryData.map(
                  (d: any, i: number) => (
                    <div key={i}>
                      <span className='tooltipLabel'>{d.Year}: </span>
                      <span className='tooltipValue'>
                        {Number(d['Multidimensional Poverty Index']).toFixed(3)}
                      </span>
                    </div>
                  ),
                )}
              </div>
              <div style={{ width: '50%' }}>
                <div className='tooltipTitle'>Headcount ratio</div>
                {(data.countryValues as any).countryData.map(
                  (d: any, i: number) => (
                    <div key={i}>
                      <span className='tooltipLabel'>{d.Year}: </span>
                      <span className='tooltipValue'>
                        {Number(
                          d[
                            'Headcount ratio: Population in multidimensional poverty'
                          ],
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                  ),
                )}
              </div>
            </div>
          </>
        ) : (
          <div>
            <div className='flex-div'>
              <div style={{ width: '50%' }}>
                <div className='tooltipTitle'>MPI</div>
                <div>
                  <span className='tooltipLabel'>
                    {(data.countryValues as any).year}:{' '}
                  </span>
                  <span className='tooltipValue'>
                    {Number((data.countryValues as any).mpi).toFixed(3)}
                  </span>
                </div>
              </div>
              <div style={{ width: '50%' }}>
                <div className='tooltipTitle'>Headcount ratio</div>
                <div>
                  <span className='tooltipLabel'>
                    {(data.countryValues as any).year}:{' '}
                  </span>
                  <span className='tooltipValue'>
                    {Number((data.countryValues as any).headcountRatio).toFixed(
                      2,
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </TooltipEl>
  );
}
