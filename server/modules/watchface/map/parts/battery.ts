import { ParamMap } from '../../types'
import { generateUnknownChildren } from '../helpers'
import { NumberMap } from './basics'
import { ImageSetMap } from './images'

export const BatteryMap: ParamMap = {
  name: 'battery',
  children: {
    1: {
      name: 'text',
      children: Object.assign({}, NumberMap.children, {
        1: { name: 'topLeftXModified', children: generateUnknownChildren(9) }
      })
    },
    2: { ...ImageSetMap, name: 'batteryIcon' },
    3: { ...ImageSetMap, name: 'icon' },
    5: { name: 'unknown5' },
    6: { name: 'unknown6' }
  }
}
