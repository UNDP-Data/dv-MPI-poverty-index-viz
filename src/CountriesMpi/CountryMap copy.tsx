/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeSubnational } from '../Types';

interface Props {
  data: MpiDataTypeSubnational[];
  country: string;
}

export function CountryMap(props: Props) {
  const { data, country } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  console.log('data', data, 'country', country);
  useEffect(() => {
    // initiate map and add base layer
    (map as any).current = new maplibreGl.Map({
      container: mapContainer.current as any,
      style: {
        version: 8,
        sources: {
          admin2: {
            type: 'vector',
            tiles: [
              'https://undpngddlsgeohubdev01.blob.core.windows.net/admin/adm2_polygons/{z}/{x}/{y}.pbf',
            ],
          },
        },
        layers: [
          {
            id: 'admin2fill',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            paint: {
              'fill-color': '#FFFFFF',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin2line',
            type: 'line',
            source: 'admin2',
            'source-layer': 'adm2_polygons',
            paint: {
              'line-color': '#888',
              'line-width': 1,
            },
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [34.3014, -13.2512],
      zoom: 4, // starting zoom
    });
    (map as any).current.on('load', () => {
      data.forEach((row, i) => {
        console.log('row', row, i);
        (map as any).current.setFeatureState(
          {
            source: 'admin2',
            sourceLayer: 'adm2_polygons',
            'source-layer': 'adm2_polygons',
            id: row.subregion,
          },
          {
            mpi: Number(row.mpi),
          },
        );
      });
      (map as any).current.addLayer({
        id: 'admin2fill',
        type: 'fill',
        source: 'admin2',
        sourceLayer: 'adm2_polygons',
        'source-layer': 'adm2_polygons',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'mpi'],
            0,
            UNDPColorModule.sequentialColors.negativeColorsx10[0],
            0.0999,
            UNDPColorModule.sequentialColors.negativeColorsx10[0],
            0.1,
            UNDPColorModule.sequentialColors.negativeColorsx10[1],
            0.1999,
            UNDPColorModule.sequentialColors.negativeColorsx10[1],
            0.2,
            UNDPColorModule.sequentialColors.negativeColorsx10[2],
            0.2999,
            UNDPColorModule.sequentialColors.negativeColorsx10[2],
            0.3,
            UNDPColorModule.sequentialColors.negativeColorsx10[3],
            0.3999,
            UNDPColorModule.sequentialColors.negativeColorsx10[3],
            0.4,
            UNDPColorModule.sequentialColors.negativeColorsx10[4],
            0.4999,
            UNDPColorModule.sequentialColors.negativeColorsx10[4],
            0.5,
            UNDPColorModule.sequentialColors.negativeColorsx10[5],
            0.5999,
            UNDPColorModule.sequentialColors.negativeColorsx10[5],
            0.6,
            UNDPColorModule.sequentialColors.negativeColorsx10[6],
            0.6999,
            UNDPColorModule.sequentialColors.negativeColorsx10[6],
            0.7,
            UNDPColorModule.sequentialColors.negativeColorsx10[7],
            0.7999,
            UNDPColorModule.sequentialColors.negativeColorsx10[7],
            0.8,
            UNDPColorModule.sequentialColors.negativeColorsx10[8],
            0.8999,
            UNDPColorModule.sequentialColors.negativeColorsx10[8],
            0.9,
            UNDPColorModule.sequentialColors.negativeColorsx10[9],
            1,
            UNDPColorModule.sequentialColors.negativeColorsx10[9],
          ],
        },
      });
    });
  }, [data]);
  return (
    <div>
      <div ref={mapContainer} className='map' />
    </div>
  );
}
