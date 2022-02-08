import { BandType, ResourceType } from './constants'

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface ColorRaw extends Color {
    u32: number
    u24: number
}

export interface Param {
  id: number;
  flags: number;
  value: bigint;
  children: Param[];
}

export interface ParsedParam extends Param {
  size: number;
}

export type ParamMapType = 'bool' | 'color' | 'array';

export interface ParamMap {
  name: string;
  type?: ParamMapType;
  children?: { [key: number]: ParamMap };
}

export interface ParamTable {
  [id: number]: Param[];
}

export interface MappedParamTable {
  [name: string]: unknown;
}

export interface Resource {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface ParsedResource extends Resource {
  id: number;
  type: ResourceType;
  rowLength: number;
  bitsPerPixel: number;
  paletteColors: number;
  palette?: Color[];
  transparency: number;
}

export interface WritableParam {
  id: number;
  value?: bigint;
  children?: WritableParam[];
}

export interface Watchface {
  band: BandType;
  params: MappedParamTable;
  resources: Resource[];
}

export interface ParsedWatchface extends Watchface {
  resources: ParsedResource[];
}
