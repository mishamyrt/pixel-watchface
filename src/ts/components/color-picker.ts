import Pickr from '@simonwep/pickr'
import convert from 'color-convert'
import { Color } from '../services/color'
import { ColorPresets } from './color-presets'

const BUTTON_SELECTOR = 'button.__muted'

const PICKR_OPTIONS: Pickr.Options = {
  el: BUTTON_SELECTOR,
  theme: 'nano',
  useAsButton: true,

  components: {
    preview: true,
    opacity: false,
    hue: true,

    interaction: {
      hex: false,
      rgba: false,
      hsla: false,
      hsva: false,
      cmyk: false,
      input: true,
      clear: false,
      save: true
    }
  }
}

function rgbaToHex (c: number[]): string {
  return '#' + convert.rgb.hex([c[0], c[1], c[2]])
}

export function initializeColorPicker () {
  const pickr = Pickr.create(PICKR_OPTIONS)
  let isFirst = true
  pickr
    .on('save', () => pickr.hide())
    .on('init', () => pickr.setColor(Color.get()))
    .on('change', () => {
      const color = rgbaToHex(pickr.getColor().toRGBA())
      Color.set(color)
      if (!isFirst) {
        ColorPresets.removeCheck()
      }
      isFirst = false
    })
}
