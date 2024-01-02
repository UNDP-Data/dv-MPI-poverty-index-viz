export interface BboxCoords {
  lat: number;
  lon: number;
}

export interface BboxDataType {
  sw: BboxCoords;
  ne: BboxCoords;
}
export interface MpiDataType {
  country: string;
  iso_a3: string;
  region: string;
  year?: string;
  mpi: number;
  headcountRatio: number;
  intensity: number;
}
export interface MpiDataTypeNational extends MpiDataType {
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
  bbox: BboxDataType;
  percentChange: number;
  countryData: MpiDataTypeNational[];
  note: string;
}
export interface MpiDataTypeSubnational extends MpiDataType {
  subregion: string;
  adminLevel: string;
}
export interface MpiDataTypeLocation extends MpiDataType {
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
  value: number;
  headcountRatio: number;
  intensity: number;
  year?: string;
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
