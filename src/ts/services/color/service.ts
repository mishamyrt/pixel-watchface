import { singletonFrom } from '../../utilities'
import { Browser } from '../browser'
import { renderTheme } from './theme'
import { Theme } from './types'

const DEFAULT_COLOR = '#9CF6B1'

class ColorService {
  private color = DEFAULT_COLOR
  private theme: Record<string, string>

  constructor () {
    this.theme = renderTheme(this.color)
  }

  set (color: string) {
    this.color = color
    this.theme = renderTheme(color)
    Browser.setProperties(this.theme)
    Browser.setThemeColor(this.theme.background)
  }

  get () {
    return this.color
  }

  getTheme () {
    return this.theme
  }

  private generateTheme (color: string): Theme {
    return {
      background: color,
      card: '#FFF'
    }
  }
}

export const Color = singletonFrom(ColorService)
