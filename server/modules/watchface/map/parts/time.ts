import { ParamMap } from '../../types'
import { CoordinatesMap } from './basics'
import { ImageMap, ImageSetMap } from './images'

export const TwoDigitsMap: ParamMap = {
  name: 'twoDigits',
  children: {
    1: {
      ...ImageSetMap,
      name: 'tens'
    },
    2: {
      ...ImageSetMap,
      name: 'ones'
    }
  }
}

export const ClockHandMap: ParamMap = {
  name: 'clockHand',
  children: {
    1: { name: 'onlyBorder', type: 'bool' },
    2: { name: 'color', type: 'color' },
    3: { ...CoordinatesMap, name: 'center' },
    4: { ...CoordinatesMap, name: 'shape', type: 'array' },
    5: { ...ImageMap, name: 'centerImage' }
  }
}

export const DayAmPmMap: ParamMap = {
  name: 'dayAmPm',
  children: {
    1: { name: 'topLeftX' },
    2: { name: 'topLeftY' },
    3: { name: 'imageIndexAMCN' },
    4: { name: 'imageIndexPMCN' },
    5: { name: 'imageIndexAMEN' },
    6: { name: 'imageIndexPMEN' }
  }
}

export const AmPmMap: ParamMap = {
  name: 'image',
  children: {
    1: { name: 'x' },
    2: { name: 'y' },
    3: { name: 'imageIndexAm' },
    4: { name: 'imageIndexPm' }
  }
}
