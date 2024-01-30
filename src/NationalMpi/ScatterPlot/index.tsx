import { MpiDataTypeNational, MpiDataTypeLocation } from '../../Types';
import { ScatterPlotChart } from './ScatterPlotChart';

interface Props {
  rural?: MpiDataTypeLocation;
  urban?: MpiDataTypeLocation;
  total?: MpiDataTypeNational;
  id: string;
  country: string;
}
export function ScatterPlot(props: Props) {
  const { rural, urban, total, id, country } = props;
  return (
    <div>
      <ScatterPlotChart
        urban={urban}
        rural={rural}
        total={total}
        id={id}
        country={country}
      />
    </div>
  );
}
