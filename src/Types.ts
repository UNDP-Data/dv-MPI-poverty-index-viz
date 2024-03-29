/* eslint-disable @typescript-eslint/no-explicit-any */
export interface BboxCoords {
  lat: number;
  lon: number;
}

export interface BboxDataType {
  sw: BboxCoords;
  ne: BboxCoords;
}
export interface MpiDataTypeBase {
  country: string;
  iso_a3: string;
  region: string;
  year?: string;
  mpi: number;
  headcountRatio: number;
  intensity: number;
}
export interface MpiDataType extends MpiDataTypeBase {
  povertyWB: number;
  headcountThousands: number;
  coordinates: [number, number];
  annualizedChangeHeadcount: number | undefined;
  countryData: any[];
  displayDifference: boolean;
}
export interface MpiDataTypeNational extends MpiDataTypeBase {
  indicatorFiles?: string[];
  displayMap: boolean;
  note: string;
  reportName: string;
  reportUrl: string;
  placement: string;
  page: string;
}
export interface MpiDataTypeNationalYears {
  iso_a3: string;
  country: string;
  region: string;
  yearImplementation: undefined | number;
  measurements: number;
  bbox: BboxDataType;
  coordinates: [number, number];
  annualizedChangeMPI: number;
  annualizedChangeHeadcount: number;
  countryData: MpiDataTypeNational[];
  indicatorChange: string;
}
export interface MpiDataTypeSubnational extends MpiDataTypeBase {
  subregion: string;
  adminLevel: string;
}
export interface MpiDataTypeLocation extends MpiDataTypeBase {
  location: string;
}
export interface MpiComponentsType {
  mpi: number;
  headcountR: number;
  intensity: number;
}
export interface MpiDataTypeDiff {
  country: string;
  iso_a3: string;
  region: string;
  year?: string;
  mpiUrban: MpiComponentsType;
  mpiRural: MpiComponentsType;
  ldiff: MpiComponentsType;
  mpiFemale: MpiComponentsType;
  mpiMale: MpiComponentsType;
  gdiff: MpiComponentsType;
}

export interface WorldFeatures {
  type: string;
  geometry: MapGeometry;
  properties: {
    fid_1: number;
    OBJECTID: number;
    ISO2: string;
    NAME: string;
    LON: number;
    LAT: number;
    ISO3: string;
    Shape_Area: number;
  };
}
export interface MapGeometry {
  type: string;
  coordinates: unknown;
}
export interface HoverDataType {
  country: string;
  continent: string;
  countryValues: object;
  xPosition: number;
  yPosition: number;
}
export interface HoverSubnatDataType {
  subregion: string;
  country: string;
  value: number;
  headcountRatio?: number;
  intensity?: number;
  xPosition: number;
  yPosition: number;
}
