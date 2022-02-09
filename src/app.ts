import { generatePallete } from './modules/color'
import { downloadFile } from './modules/file'
import { ColorPresets } from './modules/presets'
import { initializePreview } from './modules/preview'
import { postJson } from './modules/requests'
import Pickr from '@simonwep/pickr'
import convert from 'color-convert'

const button = document.querySelector<HTMLButtonElement>('button.__filled')
// const input = document.querySelector<HTMLInputElement>('.colorInput input')
const theme = document.querySelector('meta[name="theme-color"]')

if (!button || !theme) {
  throw new Error('Element not found')
}

let currentColor = ''

const presets = new ColorPresets(
  [...document.querySelectorAll<HTMLInputElement>('.colorPresets-item')]
)
presets.onChange(updateAccentColor)

const pickr = Pickr.create({
  el: 'button.__muted',
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
})
let isFirst = true
pickr
  .on('save', () => pickr.hide())
  .on('change', () => {
    const c = pickr.getColor().toRGBA()
    updateAccentColor('#' + convert.rgb.hex([c[0], c[1], c[2]]))
    if (!isFirst) {
      presets.removeCheck()
    }
    isFirst = false
  })
  .on('init', () => {
    pickr.setColor(currentColor)
  })

function updateAccentColor (color: string) {
  const pallete = generatePallete(color)
  for (const name in pallete) {
    document.body.style.setProperty(`--color-${name}`, pallete[name])
  }
  currentColor = color
  document.body.style.setProperty('--accent-color', color)
  theme?.setAttribute('content', pallete.background)
}

updateAccentColor(currentColor)
initializePreview()

button.onclick = async () => {
  const res = await postJson('/render', { color: currentColor })
  if (![200, 301].includes(res.status)) {
    throw new Error('Could not download watch face')
  }
  const blob = await res.blob()
  return downloadFile(blob, 'pixel.bin')
}

if ('serviceWorker' in navigator) {
  self.addEventListener('load', async () => {
    const container = navigator.serviceWorker
    if (container.controller === null) {
      await container.register('sw.js')
    }
  })
}
