/* eslint-disable no-console */
import { useRef } from 'react';
// import { Radio, RadioChangeEvent } from 'antd';
import { MpiDataTypeNationalYears } from '../../Types';
import { Graph } from './Graph';

interface Props {
  data: MpiDataTypeNationalYears[];
}

export function HorizontalBarChart(props: Props) {
  const { data } = props;
  /* const options = [
    { value: 'mpi', name: 'MPI' },
    { value: 'headcountRatio', name: 'Headcount Ratio' },
  ]; */
  // const [radioSelection, setRadioSelection] = useState(options[0]);
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div ref={containerRef}>
      <Graph data={data} svgWidth={600} svgHeight={data.length * 20 + 60} />
    </div>
  );
}
