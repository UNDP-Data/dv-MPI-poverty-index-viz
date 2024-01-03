import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { MpiDataTypeSubnational } from '../../Types';
import { LollipopChart } from './LollipopChart';

interface Props {
  data: MpiDataTypeSubnational[];
  sortedBy: string;
}

const LollipopChartEl = styled.div`
  height: 540px;
  background-color: var(--black-100);
  box-shadow: var(--shadow);
  border-radius: 2px;
  overflow: auto;
  padding-top: 10px;
`;
export function LollipopChartViz(props: Props) {
  const { data, sortedBy } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState<number | 800>(800);
  useEffect(() => {
    if (containerRef.current) {
      setSvgWidth(containerRef.current.clientWidth);
    }
  }, [data]);
  return (
    <div className='lollipop-container' ref={containerRef}>
      <div className='flex-div flex-wrap margin-top-00 lollipop-header'>
        <div style={{ width: '25%', fontWeight: '600' }}>Regions</div>
        <div style={{ width: '20%', fontWeight: '600' }}>MPI value</div>
        <div className='legend-container'>
          <div className='legend-item'>
            <div
              className='legend-circle-small'
              style={{
                backgroundColor: '#FFF',
                border: '3px solid #59BA47',
              }}
            />
            <div>Intensity</div>
          </div>
          <div className='legend-item'>
            <div
              className='legend-circle-small'
              style={{
                backgroundColor: '#FFF',
                border: '3px solid #FBC412',
              }}
            />
            <div>Headcount ratio</div>
          </div>
        </div>
      </div>
      <LollipopChartEl className='undp-scrollbar'>
        <LollipopChart data={data} sortedByKey={sortedBy} svgWidth={svgWidth} />
      </LollipopChartEl>
    </div>
  );
}
