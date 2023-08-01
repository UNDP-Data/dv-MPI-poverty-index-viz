/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as pmtiles from 'pmtiles';
import UNDPColorModule from 'undp-viz-colors';
import { MpiDataTypeNational, HoverSubnatDataType } from '../Types';
import { TooltipSubnational } from '../Components/TooltipSubnational';

interface Props {
  countryData?: MpiDataTypeNational;
  selectedAdminLevel: string;
  adminLevels: string[];
}
export function CountryMap(props: Props) {
  const { countryData, selectedAdminLevel, adminLevels } = props;
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const protocol = new pmtiles.Protocol();
  let lat = 0;
  let lon = 0;
  const [hoverData, setHoverData] = useState<null | HoverSubnatDataType>(null);
  let visibilityValue;

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
            url: 'pmtiles://../data/geoBADM0.pmtiles',
          },
          admin2: {
            type: 'vector',
            url: 'pmtiles://../data/adm_Export_jso_FeaturesToJSO.pmtiles',
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
        ],
      },
      center: [lon, lat],
      zoom: 4, // starting zoom
    });
    (map as any).current.on('load', () => {
      // console.log('in on load');
      adminLevels.forEach(adminLevel => {
        visibilityValue =
          adminLevel === selectedAdminLevel ? 'visible' : 'none';

        (map as any).current.addLayer({
          id: `choroplethAdmin${adminLevel}`,
          type: 'fill',
          source: 'admin2',
          'source-layer': 'adm_Export_jso_FeaturesToJSO',
          filter: ['==', 'admin level', adminLevel],
          layout: {
            visibility: visibilityValue,
          },
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
            'fill-outline-color': '#fff' /* 'hsla(0, 0%, 100%, 0.1)', */,
          },
        });
        (map as any).current.addLayer({
          id: `overlayAdmin${adminLevel}`,
          type: 'fill',
          source: 'admin2',
          'source-layer': 'adm_Export_jso_FeaturesToJSO',
          layout: {
            visibility: visibilityValue,
          },
          paint: {
            'fill-color': '#000',
            'fill-opacity': [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.2,
              0,
            ],
          },
        });
      });

      (map as any).current.setFilter(`choroplethAdmin${selectedAdminLevel}`, [
        '==',
        'country',
        countryData?.country,
      ]);
      (map as any).current.setFilter(`overlayAdmin${selectedAdminLevel}`, [
        '==',
        'country',
        countryData?.country,
      ]);
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
        (map as any).current.getLayer(`choroplethAdmin${selectedAdminLevel}`)
      ) {
        (map as any).current.setFilter(`choroplethAdmin${selectedAdminLevel}`, [
          '==',
          'country',
          countryData?.country,
        ]);
        (map as any).current.flyTo({
          center: [lon, lat],
        });
        (map as any).current.fitBounds([
          [countryData?.bbox.sw.lon, countryData?.bbox.sw.lat],
          [countryData?.bbox.ne.lon, countryData?.bbox.ne.lat],
        ]);
      }
    }
  }, [countryData?.country]);
  // when changing selectedAdminLevel
  useEffect(() => {
    let districtHoveredStateId: string | null = null;
    if (map.current) {
      adminLevels.forEach(adminLevel => {
        visibilityValue =
          adminLevel === selectedAdminLevel ? 'visible' : 'none';
        if ((map as any).current.getLayer(`choroplethAdmin${adminLevel}`)) {
          (map as any).current.setLayoutProperty(
            `choroplethAdmin${adminLevel}`,
            'visibility',
            visibilityValue,
          );
        }
        if ((map as any).current.getLayer(`overlayAdmin${adminLevel}`)) {
          (map as any).current.setLayoutProperty(
            `overlayAdmin${adminLevel}`,
            'visibility',
            visibilityValue,
          );
        }
      });
      (map as any).current.on(
        'mousemove',
        `overlayAdmin${selectedAdminLevel}`,
        (e: any) => {
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
              headcountRatio:
                e.features[0].properties['Headcount Ratio (H, %)'],
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
        },
      );

      (map as any).current.on(
        'mouseleave',
        `overlayAdmin${selectedAdminLevel}`,
        () => {
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
        },
      );
    }
  }, [selectedAdminLevel]);
  return (
    <div>
      <div ref={mapContainer} className='map' />
      {hoverData ? <TooltipSubnational data={hoverData} /> : null}
    </div>
  );
}
