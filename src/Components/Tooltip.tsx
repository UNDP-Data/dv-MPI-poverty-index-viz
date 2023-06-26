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
  background-color: var(--gray-200);
  border: 1px solid var(--gray-300);
  word-wrap: break-word;
  top: ${(props: { verticalAlignment: string; y: number }) =>
    props.verticalAlignment === 'bottom' ? props.y - 40 : props.y + 40}px;
  left: ${(props: { horizontalAlignment: string; x: number }) =>
    props.horizontalAlignment === 'left' ? props.x - 20 : props.x + 20}px;
  max-width: 24rem;
  transform: ${(props: {
    horizontalAlignment: string;
    verticalAlignment: string;
  }) =>
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
            ({data.continent})
          </span>
        </h6>
      </div>
      <hr className='undp-style margin-top-00 margin-bottom-00' />
      <div
        style={{
          padding: 'var(--spacing-05) var(--spacing-05) 0 var(--spacing-05)',
        }}
      >
        <div>{`MPI: ${data.value.toFixed(3)}`}</div>
        <div>{`Population in poverty: ${data.headcountRatio.toFixed(2)}%`}</div>
        <div>{`Year: ${data.year}`}</div>
      </div>
    </TooltipEl>
  );
}
