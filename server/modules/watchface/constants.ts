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
