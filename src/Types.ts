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
  bbox: BboxDataType;
}
export interface MpiDataTypeSubnational extends MpiDataType {
  subregion: string;
}
export interface MpiDataTypeLocation extends MpiDataType {
  location: string;
}
export interface MpiDataTypeDiff {
  country: string;
  iso_a3: string;
  region: string;
  year?: string;
  mpiUrban: number;
  yearUrban?: string;
  mpiRural: number;
  yearRural?: string;
  ldiff: number;
  mpiFemale: number;
  yearFemale?: string;
  mpiMale: number;
  yearMale?: string;
  gdiff: number;
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
  year: number;
  xPosition: number;
  yPosition: number;
}
export interface HoverSubnatDataType {
  subregion: string;
  country: string;
  value: number;
  headcountRatio: number;
  intensity: number;
  year: string;
  xPosition: number;
  yPosition: number;
}
