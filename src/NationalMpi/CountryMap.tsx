/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
import UNDPColorModule from 'undp-viz-colors';
import { HoverSubnatDataType, MpiDataTypeNationalYears } from '../Types';
import { TooltipSubnational } from './TooltipSubnational';

interface Props {
  countryData?: MpiDataTypeNationalYears;
  selectedAdminLevel: string;
  mapHeight: number;
  mapWidth: number;
}
export function CountryMap(props: Props) {
  const { countryData, selectedAdminLevel, mapHeight, mapWidth } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const protocol = new pmtiles.Protocol();
  let lat = 0;
  let lon = 0;
  const [hoverData, setHoverData] = useState<null | HoverSubnatDataType>(null);
  useEffect(() => {
    if (
      countryData !== undefined &&
      countryData.bbox.ne !== undefined &&
      countryData.bbox.sw !== undefined
    ) {
      lon = (countryData.bbox.ne.lon + countryData.bbox.sw.lon) / 2;
      lat = (countryData.bbox.ne.lat + countryData.bbox.sw.lat) / 2;
    }
    maplibreGl.addProtocol('pmtiles', protocol.tile);
    if (map.current) return;
    // initiate map and add base layer
    (map as any).current = new maplibreGl.Map({
      container: mapContainer.current as any,
      style: {
        version: 8,
        sources: {
          admin0: {
            type: 'vector',
            url: 'pmtiles://https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-data-repo/main/geoBADM0.pmtiles',
          },
          admin2: {
            type: 'vector',
            url: 'pmtiles://https://raw.githubusercontent.com/UNDP-Data/Access-All-Data-Viz/production/public/data/PMTiles/adm_Export_jso_FeaturesToJSO.pmtiles',
          },
        },
        layers: [
          {
            id: 'admin0fill',
            type: 'fill',
            source: 'admin0',
            'source-layer': 'geoBADM0',
            paint: {
              'fill-color': '#EDEFF0',
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: 'admin0line',
            type: 'line',
            source: 'admin0',
            'source-layer': 'geoBADM0',
            paint: {
              'line-color': '#fff',
              'line-width': 1,
            },
            minzoom: 0,
            maxzoom: 22,
          },
          {
            id: `choropleth`,
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm_Export_jso_FeaturesToJSO',
            filter: ['==', 'admin level', selectedAdminLevel],
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'MPI'],
                0,
                UNDPColorModule.sequentialColors.negativeColorsx07[0],
                0.0999,
                UNDPColorModule.sequentialColors.negativeColorsx07[0],
                0.1,
                UNDPColorModule.sequentialColors.negativeColorsx07[1],
                0.1999,
                UNDPColorModule.sequentialColors.negativeColorsx07[1],
                0.2,
                UNDPColorModule.sequentialColors.negativeColorsx07[2],
                0.2999,
                UNDPColorModule.sequentialColors.negativeColorsx07[2],
                0.3,
                UNDPColorModule.sequentialColors.negativeColorsx07[3],
                0.3999,
                UNDPColorModule.sequentialColors.negativeColorsx07[3],
                0.4,
                UNDPColorModule.sequentialColors.negativeColorsx07[4],
                0.4999,
                UNDPColorModule.sequentialColors.negativeColorsx07[4],
                0.5,
                UNDPColorModule.sequentialColors.negativeColorsx07[5],
                0.5999,
                UNDPColorModule.sequentialColors.negativeColorsx07[5],
                0.6,
                UNDPColorModule.sequentialColors.negativeColorsx07[6],
                1,
                UNDPColorModule.sequentialColors.negativeColorsx07[6],
              ],
              'fill-outline-color': '#fff',
            },
          },
          {
            id: 'overlay',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'adm_Export_jso_FeaturesToJSO',
            filter: ['==', 'admin level', selectedAdminLevel],
            paint: {
              'fill-color': '#000',
              'fill-opacity': [
                'case',
                ['boolean', ['feature-state', 'hover'], false],
                0.2,
                0,
              ],
            },
          },
        ],
      },
      center: [lon, lat],
      zoom: 4, // starting zoom
    });
    (map as any).current.on('load', () => {
      const filters = [
        'all',
        ['==', 'ISO', countryData?.iso_a3],
        ['==', 'admin level', selectedAdminLevel],
      ];
      (map as any).current.setFilter('choropleth', filters);
      (map as any).current.setFilter('overlay', filters);

      let districtHoveredStateId: string | null = null;
      (map as any).current.on('mousemove', 'overlay', (e: any) => {
        (map as any).current.getCanvas().style.cursor = 'pointer';
        if (e.features.length > 0) {
          if (districtHoveredStateId) {
            (map as any).current.setFeatureState(
              {
                source: 'admin2',
                id: districtHoveredStateId,
                sourceLayer: 'adm_Export_jso_FeaturesToJSO',
              },
              { hover: false },
            );
          }
          districtHoveredStateId = e.features[0].id;
          setHoverData({
            subregion: e.features[0].properties.region,
            country: e.features[0].properties.country,
            value: e.features[0].properties.MPI,
            intensity: e.features[0].properties['Intensity (A, %)'],
            headcountRatio: e.features[0].properties['Headcount Ratio (H, %)'],
            xPosition: e.originalEvent.clientX,
            yPosition: e.originalEvent.clientY,
          });
          (map as any).current.setFeatureState(
            {
              source: 'admin2',
              id: districtHoveredStateId,
              sourceLayer: 'adm_Export_jso_FeaturesToJSO',
            },
            { hover: true },
          );
        }
      });
      (map as any).current.on('mouseleave', 'overlay', () => {
        if (districtHoveredStateId) {
          setHoverData(null);
          (map as any).current.setFeatureState(
            {
              source: 'admin2',
              id: districtHoveredStateId,
              sourceLayer: 'adm_Export_jso_FeaturesToJSO',
            },
            { hover: false },
          );
        }
        districtHoveredStateId = null;
      });

      (map as any).current.fitBounds([
        [countryData?.bbox.sw.lon, countryData?.bbox.sw.lat],
        [countryData?.bbox.ne.lon, countryData?.bbox.ne.lat],
      ]);
    });
  }, []);
  // when changing country
  useEffect(() => {
    if (
      countryData !== undefined &&
      countryData.bbox.ne !== undefined &&
      countryData.bbox.sw !== undefined
    ) {
      lon = (countryData.bbox.ne.lon + countryData.bbox.sw.lon) / 2;
      lat = (countryData.bbox.ne.lat + countryData.bbox.sw.lat) / 2;
    } else {
      lon = 0;
      lat = 0;
    }

    if (map.current) {
      if (
        (map as any).current.getLayer('choropleth') &&
        (map as any).current.getLayer('overlay')
      ) {
        const filters = [
          'all',
          ['==', 'ISO', countryData?.iso_a3],
          ['==', 'admin level', selectedAdminLevel],
        ];
        (map as any).current.setFilter('choropleth', filters);
        (map as any).current.setFilter('overlay', filters);

        (map as any).current.flyTo({
          center: [lon, lat],
        });
        (map as any).current.fitBounds([
          [countryData?.bbox.sw.lon, countryData?.bbox.sw.lat],
          [countryData?.bbox.ne.lon, countryData?.bbox.ne.lat],
        ]);
      }
    }
  }, [countryData?.iso_a3]);
  // when changing selectedAdminLevel
  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('choropleth') &&
        (map as any).current.getLayer('overlay')
      ) {
        const filters = [
          'all',
          ['==', 'ISO', countryData?.iso_a3],
          ['==', 'admin level', selectedAdminLevel],
        ];
        (map as any).current.setFilter('choropleth', filters);
        (map as any).current.setFilter('overlay', filters);
      }
    }
  }, [selectedAdminLevel]);
  return (
    <div ref={containerRef}>
      <div
        id='mapSubnational'
        ref={mapContainer}
        className='map'
        style={{ height: `${mapHeight}px`, width: `${mapWidth}px` }}
      />
      {hoverData ? <TooltipSubnational data={hoverData} /> : null}
    </div>
  );
}
