import { Color } from '../services/color'
import { singletonFrom } from '../utilities'

const PRESET_SELECTOR = '.colorPresets-item'

type ChangeHandler = (color: string) => void

class ColorPresetsController {
  private changeHandler: ChangeHandler = () => undefined
  private color = ''
  private buttons: HTMLInputElement[]

  constructor () {
    const buttons = document.querySelectorAll<HTMLInputElement>(PRESET_SELECTOR)
    buttons.forEach(node => {
      node.onchange = () => this.handleChnage()
      node.style.setProperty('--item-color', node.value)
    })
    this.buttons = [...buttons]
    this.handleChnage()
  }

  handleChnage () {
    const node = this.buttons.find(v => v.checked)
    if (!node) {
      throw new Error('Presets not selected')
    }
    this.color = node.value
    this.emit()
  }

  removeCheck () {
    this.buttons.forEach(v => { v.checked = false })
  }

  onChange (fn: ChangeHandler) {
    this.changeHandler = fn
    this.emit()
  }

  private emit () {
    this.changeHandler(this.color)
  }
}

export const ColorPresets = singletonFrom(ColorPresetsController)

export function initializeColorPresets () {
  ColorPresets.onChange(color => Color.set(color))
}
