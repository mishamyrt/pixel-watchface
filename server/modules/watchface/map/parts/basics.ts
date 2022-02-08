import { ParamMap } from '../../types'

export const XYMap: ParamMap = {
  name: 'xy',
  children: {
    1: { name: 'x' },
    2: { name: 'y' }
  }
}

export const CoordinatesMap: ParamMap = {
  name: 'coordinates',
  children: {
    1: { name: 'x1' },
    2: { name: 'y1' },
    3: { name: 'x2' },
    4: { name: 'y2' },
    5: { name: 'x3' }
  }
}

export const NumberMap: ParamMap = {
  name: 'number',
  children: {
    1: { name: 'topLeftX' },
    2: { name: 'topLeftY' },
    3: { name: 'bottomRightX' },
    4: { name: 'bottomRightY' },
    5: { name: 'alignment' },
    6: { name: 'spacingX' },
    7: { name: 'spacingY' },
    8: { name: 'imageIndex' },
    9: { name: 'imageCount' }
  }
}

export const FormattedNumberMap: ParamMap = {
  name: 'formattedNumber',
  children: {
    1: { ...NumberMap },
    2: { name: 'suffixImageIndex' },
    3: { name: 'decimalPointImageIndex' },
    4: { name: 'suffixMilesImageIndex' }
  }
}

export const ScaleMap: ParamMap = {
  name: 'scale',
  children: {
    1: { name: 'startImageIndex' },
    2: { ...XYMap, name: 'segments' }
  }
}

export const SwitchMap: ParamMap = {
  name: 'switch',
  children: {
    1: { ...CoordinatesMap },
    2: { name: 'imageIndexOn' },
    3: { name: 'imageIndexOff' }
  }
}
