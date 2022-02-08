import { Param, ParamMap, MappedParamTable, ParamTable, ParsedParam } from '../types'
import { ParameterMap } from '../map'

function deepMapParams (params: Param[], map: ParamMap) {
  const table: MappedParamTable = {}
  for (const param of params) {
    const childMap = map.children?.[param.id]
    if (!childMap) throw new Error('Invalid Param ID: ' + param.id)
    if (param.children?.length !== 0 &&
      (!childMap.children ||
       !param.children.every(
         child => child.id in (childMap.children || {})
       ))
    ) {
      throw new Error('Param has Children but Map layout doesn\'t.')
    }
    table[childMap.name] = param.children && childMap.children
      ? deepMapParams(param.children, childMap)
      : param.value
  }
  return table
}

export function mapParams (params: ParamTable): MappedParamTable {
  const table: MappedParamTable = {}
  for (const id in params) {
    const paramMap = ParameterMap[Number(id)]
    if (!paramMap) throw new Error(`Invalid Param ID: ${id}`)
    table[paramMap.name] = deepMapParams(params[id], paramMap)
  }
  return table
}

export function totalParamSize (param: ParsedParam): bigint {
  let res = 0n
  res += BigInt(param.size)
  for (const child of param.children) {
    res += totalParamSize(child as ParsedParam)
  }
  return res
}
