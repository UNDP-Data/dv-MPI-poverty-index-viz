export interface MpiDataType {
  country: string;
  iso_a3: string;
  region: string;
  year: number;
  mpi: number;
}
export interface MpiDataTypeUrbanRural {
  country: string;
  iso_a3: string;
  region: string;
  mpiUrban: number;
  yearUrban: number;
  mpiRural: number;
  yearRural: number;
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
  year: number;
  xPosition: number;
  yPosition: number;
}
