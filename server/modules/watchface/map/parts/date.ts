import { ParamMap } from '../../types'
import { NumberMap } from './basics'

export const SeparateMonthAndDayMap: ParamMap = {
  name: 'separateMonthAndDay',
  children: {
    1: { ...NumberMap, name: 'month' },
    2: { ...NumberMap, name: 'day' },
    4: {
      ...NumberMap,
      name: 'dayNew'
    }
  }
}

export const OneLineMonthAndDayMap: ParamMap = {
  name: 'oneLineMonthAndDayMap',
  children: {
    1: { ...NumberMap },
    2: { name: 'delimiterImageIndex' },
    3: { name: 'unknown3' }
  }
}

export const MonthAndDayMap: ParamMap = {
  name: 'monthAndDay',
  children: {
    1: { ...SeparateMonthAndDayMap },
    2: { ...OneLineMonthAndDayMap },
    3: { name: 'twoDigitsMonth' },
    4: { name: 'twoDigitsDay' },
    5: { name: 'twoDigitsMonthNew' }
  }
}
