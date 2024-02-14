/* eslint-disable @typescript-eslint/no-explicit-any */
import UNDPColorModule from 'undp-viz-colors';
import { Map } from './Map';
import ImageDownloadButton from '../../Components/ImageDownloadButton';

interface Props {
  data: object[];
}

const periodColors = UNDPColorModule.sequentialColors;
export function ChoroplethNational(props: Props) {
  const { data } = props;
  return (
    <div className='map-container'>
      <Map data={data} prop='yearImplementation' colors={periodColors} />
      <div className='flex-div flex-space-between flex-wrap margin-bottom-07'>
        <div style={{ flexBasis: '60%', flexGrow: '1' }}>
          <p className='source undp-typography'>
            Source:{' '}
            <a
              className='undp-style small-font'
              href='https://www.mppn.org/applications/national-measures/'
              target='_blank'
              rel='noreferrer'
            >
              MPPN, Multidimensional Poverty Peer Network - Some national
              measures
            </a>
          </p>
        </div>
        <div>
          <ImageDownloadButton
            nodeID='nationalMpiMap'
            buttonText='Download map'
            filename='nationalMpiMap'
            buttonType='secondary'
          />
        </div>
      </div>
    </div>
  );
}
