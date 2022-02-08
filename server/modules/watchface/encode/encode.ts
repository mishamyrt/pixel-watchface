import { reverseMapParams } from './params'
import {
  Param,
  Watchface
} from '../types'
import { Writer } from './writer'

export function encode (
  { params: mappedParams, resources, band }: Watchface
) {
  const params = reverseMapParams(mappedParams)

  const data = new Writer()

  const paramDescriptors = new Writer()
  const paramTable = new Writer()

  for (const [id, value] of Object.entries(params) as [string, Param[]][]) {
    const offset = paramTable.length
    let size = 0

    for (const e of value) {
      const psize = paramTable.writeParam(e)
      size += psize
    }

    paramDescriptors.writeParam({
      id: Number(id),
      children: [
        { id: 1, value: BigInt(offset) },
        { id: 2, value: BigInt(size) }
      ]
    })
  }

  const mainParam = new Writer()
  mainParam.writeParam({
    id: 1,
    children: [
      { id: 1, value: BigInt(paramTable.length) },
      { id: 2, value: BigInt(resources.length) }
    ]
  })

  data.writeHeader(mainParam.length + paramDescriptors.length, band)

  data.push(...mainParam, ...paramDescriptors)
  data.push(...paramTable)

  const resourceOffsets = new Writer()
  const res = new Writer()

  let offset = 0
  for (const resource of resources) {
    resourceOffsets.writeUint32LE(offset)
    offset += res.writeResource(resource)
  }

  data.push(...resourceOffsets)

  const u8 = new Uint8Array(data.length + res.length)
  u8.set(data, 0)
  u8.set(res, data.length)

  return u8
}
