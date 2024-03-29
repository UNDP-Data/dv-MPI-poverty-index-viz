/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { useEffect, useRef, useState } from 'react';
import maplibreGl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  MaplibreExportControl,
  Size,
  PageOrientation,
  Format,
  DPI,
} from '@watergis/maplibre-gl-export';
import '@watergis/maplibre-gl-export/dist/maplibre-gl-export.css';
import * as pmtiles from 'pmtiles';
import UNDPColorModule from 'undp-viz-colors';
import { scaleQuantize } from 'd3-scale';
import { HoverSubnatDataType, MpiDataTypeNationalYears } from '../Types';
import { TooltipSubnational } from './TooltipSubnational';

interface Props {
  countryData?: MpiDataTypeNationalYears;
  selectedAdminLevel: string;
  mapHeight: number;
  mapWidth: number;
  subnationalMPIextent: [number, number];
}
export function CountryMap(props: Props) {
  const {
    countryData,
    selectedAdminLevel,
    mapHeight,
    mapWidth,
    subnationalMPIextent,
  } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<HTMLDivElement>(null);
  const colorScale = scaleQuantize<string, number>()
    .domain(subnationalMPIextent as [number, number])
    .range(UNDPColorModule.sequentialColors.negativeColorsx05);

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
    colorScale.domain(subnationalMPIextent as [number, number]);

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
            // url: 'pmtiles://https://raw.githubusercontent.com/UNDP-Data/Access-All-Data-Viz/production/public/data/PMTiles/adm_Export_jso_FeaturesToJSO.pmtiles',
            url: 'pmtiles://https://raw.githubusercontent.com/UNDP-Data/dv-MPI-poverty-index-data-repo/main/mpi_select_v3.pmtiles',
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
            'source-layer': 'mpi_select_v3',
            filter: ['==', 'admin_level', Number(selectedAdminLevel)],
            paint: {
              'fill-color': [
                'interpolate',
                ['linear'],
                ['get', 'MPI'],
                0,
                UNDPColorModule.sequentialColors.negativeColorsx05[0],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[0],
                )[1] - 0.0001,
                UNDPColorModule.sequentialColors.negativeColorsx05[0],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[0],
                )[1],
                UNDPColorModule.sequentialColors.negativeColorsx05[1],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[1],
                )[1] - 0.0001,
                UNDPColorModule.sequentialColors.negativeColorsx05[1],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[1],
                )[1],
                UNDPColorModule.sequentialColors.negativeColorsx05[2],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[2],
                )[1] - 0.0001,
                UNDPColorModule.sequentialColors.negativeColorsx05[2],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[2],
                )[1],
                UNDPColorModule.sequentialColors.negativeColorsx05[3],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[3],
                )[1] - 0.0001,
                UNDPColorModule.sequentialColors.negativeColorsx05[3],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[3],
                )[1],
                UNDPColorModule.sequentialColors.negativeColorsx05[4],
                colorScale.invertExtent(
                  UNDPColorModule.sequentialColors.negativeColorsx05[4],
                )[1] - 0.0001,
                UNDPColorModule.sequentialColors.negativeColorsx05[4],
              ],
              'fill-outline-color': '#fff',
            },
          },
          {
            id: 'overlay',
            type: 'fill',
            source: 'admin2',
            'source-layer': 'mpi_select_v3',
            filter: ['==', 'admin_level', Number(selectedAdminLevel)],
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
        ['==', 'ISOcountry_code', countryData?.iso_a3],
        ['==', 'admin_level', Number(selectedAdminLevel)],
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
                sourceLayer: 'mpi_select_v3',
              },
              { hover: false },
            );
          }
          districtHoveredStateId = e.features[0].id;
          // console.log('e.features[0] ---------> ', e.features[0]);
          setHoverData({
            subregion: e.features[0].properties['Admin_name_Region'],
            country: e.features[0].properties.country,
            value: e.features[0].properties.MPI,
            intensity: e.features[0].properties['Intensity__A____'],
            headcountRatio: e.features[0].properties['Headcount_Ratio__H____'],
            xPosition: e.originalEvent.clientX,
            yPosition: e.originalEvent.clientY,
          });
          (map as any).current.setFeatureState(
            {
              source: 'admin2',
              id: districtHoveredStateId,
              sourceLayer: 'mpi_select_v3',
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
              sourceLayer: 'mpi_select_v3',
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
    (map as any).current.addControl(
      new MaplibreExportControl({
        PageSize: Size.A4,
        PageOrientation: PageOrientation.Portrait,
        Format: Format.PNG,
        DPI: DPI[96],
        Crosshair: true,
        // PrintableArea: true,
      }),
      'bottom-right',
    );
  }, []);

  // when changing country
  useEffect(() => {
    colorScale.domain(subnationalMPIextent as [number, number]);

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
          ['==', 'ISOcountry_code', countryData?.iso_a3],
          ['==', 'admin_level', Number(selectedAdminLevel)],
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
        (map as any).current.setPaintProperty('choropleth', 'fill-color', [
          'interpolate',
          ['linear'],
          ['get', 'MPI'],
          0,
          UNDPColorModule.sequentialColors.negativeColorsx05[0],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[0],
          )[1] - 0.0001,
          UNDPColorModule.sequentialColors.negativeColorsx05[0],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[0],
          )[1],
          UNDPColorModule.sequentialColors.negativeColorsx05[1],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[1],
          )[1] - 0.0001,
          UNDPColorModule.sequentialColors.negativeColorsx05[1],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[1],
          )[1],
          UNDPColorModule.sequentialColors.negativeColorsx05[2],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[2],
          )[1] - 0.0001,
          UNDPColorModule.sequentialColors.negativeColorsx05[2],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[2],
          )[1],
          UNDPColorModule.sequentialColors.negativeColorsx05[3],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[3],
          )[1] - 0.0001,
          UNDPColorModule.sequentialColors.negativeColorsx05[3],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[3],
          )[1],
          UNDPColorModule.sequentialColors.negativeColorsx05[4],
          colorScale.invertExtent(
            UNDPColorModule.sequentialColors.negativeColorsx05[4],
          )[1] - 0.0001,
          UNDPColorModule.sequentialColors.negativeColorsx05[4],
        ]);
        (map as any).current.setPaintProperty(
          'choropleth',
          'fill-outline-color',
          '#fff',
        );
      }
    }
  }, [countryData?.iso_a3, subnationalMPIextent]);
  // when changing selectedAdminLevel
  useEffect(() => {
    if (map.current) {
      if (
        (map as any).current.getLayer('choropleth') &&
        (map as any).current.getLayer('overlay')
      ) {
        const filters = [
          'all',
          ['==', 'ISOcountry_code', countryData?.iso_a3],
          ['==', 'admin_level', Number(selectedAdminLevel)],
        ];
        (map as any).current.setFilter('choropleth', filters);
        (map as any).current.setFilter('overlay', filters);
      }
    }
  }, [selectedAdminLevel]);
  return (
    <div ref={containerRef} className='maplibre-show-control'>
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
