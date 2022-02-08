import { mapParams, totalParamSize } from './params'
import {
  Color,
  Param,
  ParamTable,
  ParsedParam,
  ParsedResource,
  ParsedWatchface
} from '../types'
import { ResourceType, ParamFlag, BandType, OLD_SIGN_SIZE } from '../constants'

class WatchfaceParser {
  #bin: Uint8Array;
  #view: DataView;
  #offset: number;

  constructor (bin: Uint8Array) {
    this.#bin = bin
    this.#view = new DataView(bin.buffer)
    this.#offset = 0
  }

  #readCString () {
    let str = ''
    let byte
    while ((byte = this.#bin[this.#offset++]) !== 0) {
      str += String.fromCharCode(byte)
    }
    return str
  }

  private findRequiredParam (params: Param[], id: number) {
    const node = params.find(e => e.id === id)
    if (!node) {
      throw new Error('Required param not found')
    }
    return node
  }

  parse (): ParsedWatchface {
    const header = this.parseHeader()
    const params = this.parseParamList(BigInt(header.paramsSize))

    const mainParam = this.findRequiredParam(params, 1)
    const paramTableLength = this.findRequiredParam(mainParam.children, 1).value
    const resourceCount = this.findRequiredParam(mainParam.children, 2).value

    const table: ParamTable = {}

    const storedOffset = this.#offset

    const storedBin = this.#bin

    const tableBuffer = storedBin.subarray(
      storedOffset,
      storedOffset + Number(paramTableLength)
    )

    this.#bin = tableBuffer
    this.#view = new DataView(
      storedBin.buffer,
      storedOffset,
      storedOffset + Number(paramTableLength)
    )
    this.#offset = 0

    for (const param of params) {
      if (param.id === mainParam.id) continue
      const sizeParam = param.children.find((e) => e.id === 2)
      if (!sizeParam) {
        throw new Error(`Param size not found ${param}`)
      }
      table[param.id] = this.parseParamList(sizeParam.value)
    }

    this.#offset = storedOffset + Number(paramTableLength)
    this.#bin = storedBin
    this.#view = new DataView(this.#bin.buffer)

    const resourceOffsets = []
    for (let i = 0; i < resourceCount; i++) {
      const offset = this.#view.getUint32(this.#offset, true)
      resourceOffsets.push(offset)
      this.#offset += 4
    }
    console.log(resourceOffsets)

    const resources = []

    for (let i = 0; i < resourceCount; i++) {
      resources.push(this.parseResource(i))
    }

    return {
      band: header.band,
      params: mapParams(table),
      resources
    }
  }

  sign!: string;
  paramsSize!: number;
  band!: BandType;

  parseHeader () {
    const sign = this.#readCString()
    if (sign === 'UIHH\x01') {
      // Ignore that area (in Band 5 and 6)
      this.#offset = 0x4F
    } else {
      // It should be band 4
      const restSignAreaLength = OLD_SIGN_SIZE - (sign.length + 1)
      this.#offset += restSignAreaLength
    }

    const band = this.#view.getUint32(this.#offset, true)
    this.#offset += 4

    const paramsSize = this.#view.getUint32(this.#offset, true)
    this.#offset += 4

    this.sign = sign
    this.paramsSize = paramsSize
    this.band = band

    return {
      sign,
      band,
      paramsSize
    }
  }

  parseParam (): ParsedParam {
    const byte = this.#bin[this.#offset++]

    const id = (byte & 0xF8) >> 3
    if (id < 1) {
      throw new Error(
        'Invalid parameter. Offset: ' + this.#offset.toString(16)
      )
    }

    const flags = byte & 7

    let size = 1
    let value = 0n
    let i = this.#bin[this.#offset++]
    let offset = 0
    let children: Param[] = []

    // Value is encoded in some weird way (Idk if there's some name for that)
    // So you keep reading bytes until it's first bit is 0
    // First bit tells whether the next byte is to be included
    // in the value or not. Rest 7 bits are the value.
    while ((i & 0x80) > 0) {
      if (size > 9) throw new Error('Invalid parameter value')
      value |= BigInt(i & 0x7F) << BigInt(offset)
      i = this.#bin[this.#offset++]
      offset += 7
      size++
    }

    value |= BigInt(i & 0x7F) << BigInt(offset)
    size++

    if ((flags & ParamFlag.HAS_CHILDREN) === ParamFlag.HAS_CHILDREN) {
      children = this.parseParamList(value)
    }

    return {
      id,
      flags,
      size,
      value,
      children
    }
  }

  parseParamList (size: bigint) {
    const params: Param[] = []
    let paramSizeAcum = 0n
    while (paramSizeAcum < size) {
      const param = this.parseParam()
      params.push(param)
      paramSizeAcum += totalParamSize(param)
    }
    return params
  }

  parseResource (id: number): ParsedResource {
    this.#offset += 2

    // Skip 2
    this.#offset += 2

    const header = this.parseResourceHeader()

    const palette: Color[] = []

    if (header.paletteColors > 0) {
      for (let i = 0; i < header.paletteColors; i++) {
        const r = this.#view.getUint8(this.#offset++)
        const g = this.#view.getUint8(this.#offset++)
        const b = this.#view.getUint8(this.#offset++)
        this.#offset++ // pad

        palette.push({
          r,
          g,
          b,
          a: (header.transparency > 0) && i === 0 ? 0 : 255
        })
      }
    }

    let data: Uint8Array

    if (header.type === ResourceType.PALETTE) {
      data = new Uint8Array(header.width * header.height * 4)
      for (let y = 0; y < header.height; y++) {
        for (let x = 0; x < header.width; x++) {
          const idx = this.#view.getUint8(this.#offset)
          if (!palette[idx]) {
            throw new Error(
              `Expected palette color at index ${idx} but palette has ${palette.length} elements. Offset: ${this.#offset}, X: ${x}, Y: ${y}`
            )
          }
          const color = palette[idx]
          this.#offset++
          data.set(
            [color.r, color.g, color.b, color.a],
            (y * header.width + x) * 4
          )
        }
      }
    } else if (header.type === ResourceType.BIT_8) {
      data = new Uint8Array(header.width * header.height * 4)
      for (let y = 0; y < header.height; y++) {
        for (let x = 0; x < header.width; x++) {
          const color = this.#view.getUint8(this.#offset++)
          data.set(
            [color, color, color, 255],
            (y * header.width + x) * 4
          )
        }
      }
    } else if (header.type === ResourceType.BIT_16) {
      data = new Uint8Array(header.width * header.height * 4)
      for (let y = 0; y < header.height; y++) {
        for (let x = 0; x < header.width; x++) {
          const first = this.#view.getUint8(this.#offset++)
          const second = this.#view.getUint8(this.#offset++)

          // GGGRRRRRBBBBBGGG
          const r = ((first & 0b11111)) << 3
          const g = (((first >> 5 & 0b111) | (second & 0b111) << 3)) << 2
          const b = ((second >> 3 & 31)) << 3

          data.set(
            [r, g, b, 255],
            (y * header.width + x) * 4
          )
        }
      }
    } else if (header.type === ResourceType.BIT_24) {
      data = new Uint8Array(header.width * header.height * 4)
      for (let y = 0; y < header.height; y++) {
        for (let x = 0; x < header.width; x++) {
          const a = this.#view.getUint8(this.#offset++)
          const first = this.#view.getUint8(this.#offset++).toString(2)
            .padStart(8, '0')
          const second = this.#view.getUint8(this.#offset++).toString(2)
            .padStart(8, '0')
          const bits = first + second

          const b = parseInt(bits.substr(0, 5), 2) << 3
          const g = parseInt(bits.substr(5, 6), 2) << 2
          const r = parseInt(bits.substr(11, 5), 2) << 3

          data.set(
            [r, g, b, 255 - a],
            (y * header.width + x) * 4
          )
        }
      }
    } else if (header.type === ResourceType.BIT_32) {
      data = new Uint8Array(header.width * header.height * 4)
      for (let y = 0; y < header.height; y++) {
        for (let x = 0; x < header.width; x++) {
          const a = this.#view.getUint8(this.#offset++) & 0xff
          const r = this.#view.getUint8(this.#offset++) & 0xff
          const g = this.#view.getUint8(this.#offset++) & 0xff
          const b = this.#view.getUint8(this.#offset++) & 0xff

          data.set(
            [r, g, b, 255 - a],
            (y * header.width + x) * 4
          )
        }
      }
    } else throw new Error('unreachable')

    return {
      id,
      ...header,
      palette,
      data
    }
  }

  parseResourceHeader () {
    const width = this.#view.getUint16(this.#offset, true)
    this.#offset += 2

    const height = this.#view.getUint16(this.#offset, true)
    this.#offset += 2

    const rowLength = this.#view.getUint16(this.#offset, true)
    this.#offset += 2

    const bitsPerPixel = this.#view.getUint16(this.#offset, true)
    this.#offset += 2

    const paletteColors = this.#view.getUint16(this.#offset, true)
    this.#offset += 2
    if (paletteColors > 256) {
      throw new Error('Too large pallete')
    }

    const transparency = this.#view.getUint16(this.#offset, true)
    this.#offset += 2

    let type
    if (paletteColors > 0) {
      type = ResourceType.PALETTE
    } else {
      switch (bitsPerPixel) {
        case 8:
          type = ResourceType.BIT_8
          break

        case 16:
          type = ResourceType.BIT_16
          break

        case 24:
          type = ResourceType.BIT_24
          break

        case 32:
          type = ResourceType.BIT_32
          break

        default:
          throw new Error('Invalid resource type')
      }
    }

    console.log('Parse Resource Header')
    console.log('  Type:', type)
    console.log('  Width:', width)
    console.log('  Height:', height)
    console.log('  Row Length:', rowLength)
    console.log('  Bits Per Pixel:', bitsPerPixel)
    console.log('  Palette Colors:', paletteColors)
    console.log('  Transparency:', transparency)

    return {
      type,
      width,
      height,
      rowLength,
      bitsPerPixel,
      paletteColors,
      transparency
    }
  }
}

export function decode (buffer: Uint8Array) {
  return new WatchfaceParser(buffer).parse()
}
