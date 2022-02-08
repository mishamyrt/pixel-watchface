import { FormattedNumberMap, NumberMap, ScaleMap, SwitchMap } from './parts/basics'
import { BatteryMap } from './parts/battery'
import { MonthAndDayMap, OneLineMonthAndDayMap } from './parts/date'
import { AnimationImageMap, ImageMap, ImageSetMap } from './parts/images'
import { StepsMap } from './parts/steps'
import { AmPmMap, ClockHandMap, DayAmPmMap, TwoDigitsMap } from './parts/time'
import { UnknownType14D6 } from './parts/unknown'
import { AirPollutionMap, TemperatureMap, WeatherIconMap } from './parts/weather'
import { ParamMap } from '../types'
import { generateUnknownChildren } from './helpers'

export const ParameterMap: { [name: number]: ParamMap } = {
  2: {
    name: 'background',
    children: {
      1: { ...ImageMap },
      2: { name: 'unknown2' },
      3: {
        ...ImageMap,
        name: 'preview1'
      },
      4: {
        ...ImageMap,
        name: 'preview2'
      },
      5: {
        ...ImageMap,
        name: 'preview3'
      }
    }
  },
  3: {
    name: 'time',
    children: {
      1: { ...TwoDigitsMap, name: 'hours' },
      2: { ...TwoDigitsMap, name: 'minutes' },
      3: { ...TwoDigitsMap, name: 'seconds' },
      4: { ...AmPmMap, name: 'amPm' },
      5: { name: 'drawingOrder' },
      6: { name: 'unknown6', children: generateUnknownChildren(3) },
      7: { name: 'unknown7' },
      8: { name: 'unknown8' },
      9: { name: 'unknown9' },
      10: { name: 'unknown10' },
      11: { name: 'unknown11' }
    }
  },
  4: {
    name: 'activity',
    children: {
      1: { ...StepsMap },
      2: { ...NumberMap, name: 'stepsGoal' },
      3: { ...OneLineMonthAndDayMap, name: 'calories' },
      4: { ...OneLineMonthAndDayMap, name: 'pulse' },
      5: { ...FormattedNumberMap, name: 'distance' },
      6: { name: 'unknown6' },
      7: { name: 'unknown7' }
    }
  },
  5: {
    name: 'date',
    children: {
      1: { ...MonthAndDayMap },
      2: { ...ImageSetMap, name: 'weekDay' },
      3: { ...DayAmPmMap },
      4: { ...ImageSetMap, name: 'enWeekDays' },
      5: {
        name: 'unknown5',
        children: generateUnknownChildren(4)
      },
      6: {
        name: 'unknown6',
        children: generateUnknownChildren(4)
      }
    }
  },
  6: {
    name: 'weather',
    children: {
      1: { ...WeatherIconMap, name: 'icon' },
      2: { ...TemperatureMap, name: 'temperature' },
      3: { ...AirPollutionMap }
    }
  },
  7: {
    name: 'steps',
    children: {
      1: { ...NumberMap },
      2: { name: 'prefixImageIndex' },
      3: {
        name: 'unknown3',
        children: {
          1: { name: 'unknown1' },
          2: { name: 'unknown2', children: generateUnknownChildren(2) },
          3: { name: 'unknown3' }
        }
      }
    }
  },
  8: {
    name: 'status',
    children: {
      1: { ...SwitchMap, name: 'alarm' },
      2: { ...SwitchMap, name: 'lock' },
      3: { ...SwitchMap, name: 'bluetooth' },
      4: { ...BatteryMap }
    }
  },
  9: BatteryMap,
  10: {
    name: 'analogDialFace',
    children: {
      1: { ...ClockHandMap, name: 'hours' },
      2: { ...ClockHandMap, name: 'minutes' },
      3: { ...ClockHandMap, name: 'seconds' }
    }
  },
  11: {
    name: 'other',
    children: {
      1: {
        name: 'animation',
        children: {
          1: { ...AnimationImageMap, name: 'image' },
          2: { name: 'x1' },
          3: { name: 'y1' },
          4: { name: 'interval' }
        }
      }
    }
  },
  12: {
    name: 'heart',
    children: {
      1: { ...ScaleMap }
    }
  },
  14: {
    name: 'unknown14',
    children: {
      1: { ...TwoDigitsMap, name: 'unknown1' },
      2: { ...TwoDigitsMap, name: 'unknown2' },
      3: { name: 'unknown3' },
      4: { name: 'unknown4' },
      5: { name: 'unknown5' },
      6: { ...UnknownType14D6, name: 'unknown6' },
      7: { ...UnknownType14D6, name: 'unknown7' },
      8: { ...UnknownType14D6, name: 'unknown8' }
    }
  }
}
