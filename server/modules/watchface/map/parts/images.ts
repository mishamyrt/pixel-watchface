import { ParamMap } from '../../types'

export const ImageMap: ParamMap = {
  name: 'image',
  children: {
    1: { name: 'x' },
    2: { name: 'y' },
    3: { name: 'imageIndex' }
  }
}

export const ImageSetMap: ParamMap = {
  name: 'imageSet',
  children: {
    1: { name: 'x' },
    2: { name: 'y' },
    3: { name: 'imageIndex' },
    4: { name: 'imageCount' },
    5: { name: 'unknown5' },
    6: { name: 'unknown6' }
  }
}

export const AnimationImageMap: ParamMap = {
  name: 'animationImage',
  children: {
    1: { name: 'x' },
    2: { name: 'y' },
    3: { name: 'imageIndex' },
    4: { name: 'imageCount' },
    5: { name: 'x3' }
  }
}
