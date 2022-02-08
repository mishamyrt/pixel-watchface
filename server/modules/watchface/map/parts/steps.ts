import { ParamMap } from '../../types'
import { NumberMap } from './basics'

export const StepsMap: ParamMap = {
  name: 'steps',
  children: {
    1: { ...NumberMap, name: 'step' },
    2: { name: 'unknown2' }
  }
}
