import { ParameterMap } from '../map'
import {
  MappedParamTable,
  Param,
  ParamMap,
  ParamMapType,
  ParamTable
} from '../types'

const converters: {
  [name in (ParamMapType | 'unknown')]: {
    encode: (v: unknown) => unknown;
    decode: (v: unknown) => unknown;
  };
} = {
  array: { encode: v => v, decode: v => v },
  bool: { encode: v => Boolean(v), decode: v => BigInt(v as bigint) },
  color: { encode: v => v, decode: v => v },
  unknown: { encode: v => v, decode: v => v }
}

export function reverseMapParams (params: MappedParamTable): ParamTable {
  const table: ParamTable = {}

  function processMapped (
    name: string,
    value: unknown,
    into: ParamTable | Param[] = table,
    getMapEntry: (name: string) => [string, ParamMap] | undefined =
    (name) => Object.entries(ParameterMap).find((e) => e[1].name === name)
  ) {
    const mapEntry = getMapEntry(name)
    if (!mapEntry) {
      throw new Error(`Invalid parameter name: ${name}`)
    }

    const [id, map] = mapEntry

    if (
      typeof value === 'string' || typeof value === 'number' ||
      typeof value === 'bigint'
    ) {
      if (Array.isArray(into)) {
        into.push({
          id: Number(id),
          value: BigInt(
            (converters[map.type ?? 'unknown']).decode(value) as string | number | bigint
          ),
          flags: 0,
          children: []
        })
      } else {
        throw new Error('Invalid param value at top level')
      }
    } else if (typeof value === 'object') {
      const res: Param[] = []
      Object.entries(value as object).forEach(([k, v]) => {
        processMapped(
          k,
          v,
          res,
          (name) =>
            Object.entries(map.children || {}).find((e) => e[1].name === name)
        )
      })
      if (Array.isArray(into)) {
        into.push({
          id: Number(id),
          value: BigInt(0),
          flags: 0,
          children: res
        })
      } else {
        into[Number(id)] = res
      }
    } else throw new Error('Invalid type: ' + typeof value)
  }

  Object.entries(params).forEach(([k, v]) => {
    processMapped(k, v)
  })

  return table
}
