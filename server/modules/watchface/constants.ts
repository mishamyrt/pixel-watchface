/**
 * Signature for Mi Band 5 and 6
 */
export const NEW_SIGN = 'UIHH\x01'

/**
 * Signature for Mi Band 4
 */
export const OLD_SIGN = 'HMDIAL'

/**
 * Mi Band 4 signature size
 */
export const OLD_SIGN_SIZE = 0x20

/**
 * Mi Band type
 */
export enum BandType {
    BAND_4 = 345,
    BAND_5 = 146,
    BAND_6 = 148,
}

export const BAND_DIMS: {
  [num in BandType]: [number, number];
} = {
  [BandType.BAND_4]: [120, 240],
  [BandType.BAND_5]: [126, 294],
  [BandType.BAND_6]: [152, 486]
}

export enum ParamFlag {
  NONE = 0,
  UNKNOWN = 1,
  HAS_CHILDREN = 2,
  UNKNOWN2 = 4,
}

export enum ResourceType {
  PALETTE,
  BIT_8,
  BIT_16,
  BIT_24,
  BIT_32,
}
