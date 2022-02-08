import { ParamMap } from '../../types'
import { CoordinatesMap } from './basics'

export const UnknownType14D6: ParamMap = {
  name: 'unknown14D6',
  children: {
    1: { ...CoordinatesMap, name: 'unknown1' },
    2: { ...CoordinatesMap, name: 'unknown2' },
    3: { name: 'unknown3' }
  }
}
