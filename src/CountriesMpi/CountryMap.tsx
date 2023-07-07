/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
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
          admin0: {
            type: 'vector',
            tiles: [
              'https://undpngddlsgeohubdev01.blob.core.windows.net/admin/adm0_polygons/{z}/{x}/{y}.pbf',
            ],
          },
        },
        layers: [
          {
            id: 'admin0fill',
            type: 'fill',
            source: 'admin0',
            'source-layer': 'adm0_polygons',
            paint: {
              'fill-color': '#FFFFFF',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin0line',
            type: 'line',
            source: 'admin0',
            'source-layer': 'adm0_polygons',
            paint: {
              'line-color': '#A9B1B7',
              'line-width': 0.5,
            },
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: [33.9391, 67.71],
      zoom: 2, // starting zoom
    });
  }, []);
  return (
    <div>
      <div ref={mapContainer} className='map' />
    </div>
  );
}
