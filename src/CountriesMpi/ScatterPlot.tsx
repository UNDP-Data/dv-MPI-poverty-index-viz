/* eslint-disable import/no-extraneous-dependencies */
// import UNDPColorModule from 'undp-viz-colors';
import { scaleLinear } from 'd3-scale';
import { MpiDataType, MpiDataTypeLocation } from '../Types';

interface Props {
  rural: MpiDataTypeLocation;
  urban: MpiDataTypeLocation;
  total: MpiDataType;
}
export function ScatterPlot(props: Props) {
  const { rural, urban, total } = props;
  const graphWidth = 1280;
  const graphHeight = 800;
  const leftPadding = 330;
  const rightPadding = 100;
  // const marginTop = 10;
  const xPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphWidth - leftPadding - rightPadding])
    .nice();
  const yPos = scaleLinear()
    .domain([0, 100])
    .range([0, graphHeight - leftPadding - rightPadding]);
  return (
    <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
      <circle
        cx={xPos(rural.intensity)}
        cy={yPos(rural.headcountRatio)}
        r={10}
      />
      <circle
        cx={xPos(urban.intensity)}
        cy={yPos(urban.headcountRatio)}
        r={10}
      />
      <circle
        cx={xPos(total.intensity)}
        cy={yPos(total.headcountRatio)}
        r={10}
      />
    </svg>
  );
}
