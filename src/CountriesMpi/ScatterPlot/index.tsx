import { useEffect, useRef, useState } from 'react';
import { MpiDataType, MpiDataTypeLocation } from '../../Types';
import { ScatterPlotChart } from './ScatterPlotChart';

interface Props {
  rural?: MpiDataTypeLocation;
  urban?: MpiDataTypeLocation;
  total?: MpiDataType;
  id: string;
  country: string;
}
export function ScatterPlot(props: Props) {
  const { rural, urban, total, id, country } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const [divWidth, setDivWidth] = useState<number | 400>(400);
  const [divHeight, setDivHeight] = useState<number | 400>(400);
  useEffect(() => {
    if (containerRef.current) {
      setDivWidth(containerRef.current.clientWidth);
      setDivHeight(containerRef.current.clientHeight);
    }
  }, []);
  return (
    <div ref={containerRef}>
      <ScatterPlotChart
        urban={urban}
        rural={rural}
        total={total}
        id={id}
        country={country}
        divWidth={divWidth}
        divHeight={divHeight}
      />
    </div>
  );
}
