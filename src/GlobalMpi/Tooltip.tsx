/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import styled from 'styled-components';
import { format } from 'd3-format';
import { HoverDataType } from '../Types';

interface Props {
  data: HoverDataType;
  prop: string;
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
  const { data, prop } = props;
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
        ) : (
          <>
            <div className='margin-bottom-03 margin-top-00'>
              <span className='tooltipValue'>
                {format(',')(
                  (data.countryValues as any).headcountThousands * 1000,
                ).replaceAll(',', ' ')}{' '}
                multidimensional poor people (2021)
              </span>
            </div>
            <hr className='undp-style margin-top-05 margin-bottom-03' />
            <div>
              <span className='tooltipLabel'>MPI: </span>
              <span className='tooltipValue'>
                {Number((data.countryValues as any)[prop]).toFixed(3)}
              </span>
            </div>
            <div>
              <span className='tooltipLabel'>Incidence: </span>
              <span className='tooltipValue'>
                {Number((data.countryValues as any).headcountRatio).toFixed(2)}%
              </span>
            </div>
            <div>
              <span className='tooltipLabel'>Intensity: </span>
              <span className='tooltipValue'>
                {Number((data.countryValues as any).intensity).toFixed(2)}%
              </span>
            </div>
            <div>
              <span className='tooltipLabel'>Survey year: </span>
              <span className='tooltipValue'>
                {(data.countryValues as any).year}
              </span>
            </div>
          </>
        )}
      </div>
    </TooltipEl>
  );
}
