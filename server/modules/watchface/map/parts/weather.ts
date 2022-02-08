import { ParamMap } from '../../types'
import { CoordinatesMap, NumberMap } from './basics'
import { ImageSetMap } from './images'

export const AirPollutionMap: ParamMap = {
  name: 'airPollution',
  children: {
    1: { ...NumberMap, name: 'index' },
    2: { ...ImageSetMap, name: 'icon' }
  }
}

export const TemperatureNumberMap: ParamMap = {
  name: 'temperatureNumber',
  children: {
    1: { ...NumberMap },
    2: { name: 'minusImageIndex' },
    3: { name: 'degreesImageIndex' }
  }
}

export const SeparateTemperatureMap: ParamMap = {
  name: 'separateTemperature',
  children: {
    1: { ...TemperatureNumberMap, name: 'day' },
    2: { ...TemperatureNumberMap, name: 'night' },
    3: { ...CoordinatesMap, name: 'dayAlt' },
    4: { ...CoordinatesMap, name: 'nightAlt' }
  }
}

export const WeatherIconMap: ParamMap = {
  name: 'weatherIcon',
  children: {
    1: { ...CoordinatesMap },
    2: { ...ImageSetMap, name: 'customIcon' },
    3: { ...CoordinatesMap, name: 'coordinatesAlt' },
    4: { ...CoordinatesMap, name: 'unknown4' }
  }
}

export const OneLineTemperatureMap: ParamMap = {
  name: 'oneLineTemperature',
  children: {
    1: { ...NumberMap },
    2: { name: 'minusSignImageIndex' },
    3: { name: 'delimiterImageIndex' },
    4: { name: 'appendDegreesForBoth', type: 'bool' },
    5: { name: 'degreesImageIndex' }
  }
}

export const TodayTemperatureMap: ParamMap = {
  name: 'todayTemperature',
  children: {
    1: { ...SeparateTemperatureMap, name: 'separate' },
    2: { ...OneLineTemperatureMap, name: 'oneLine' }
  }
}

export const TemperatureMap: ParamMap = {
  name: 'temperature',
  children: {
    1: { ...TemperatureNumberMap, name: 'current' },
    2: { ...TodayTemperatureMap, name: 'today' }
  }
}
