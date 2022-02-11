import { ThemeMap, ValueTransformer } from './types'
import convert from 'color-convert'
import { HSL } from 'color-convert/conversions'

export function range (down: number, up: number) {
  return (value: number) => down + ((up - down) * (value / 100))
}

function complementary () {
  return (hue: number) => {
    hue -= 180
    if (hue < 0) {
      hue += 360
    }
    return hue
  }
}

function transformColor (color: HSL) {
  return (transformer: ValueTransformer, i: number) => transformer ? transformer(color[i]) : color[i]
}

export const AppTheme: ThemeMap = {
  selected: [
    null,
    null,
    null
  ],
  accent: [
    null,
    range(40, 50),
    range(60, 70)
  ],
  background: [
    null,
    range(30, 40),
    range(5, 6)
  ],
  card: [
    null,
    range(20, 30),
    range(7, 12)
  ],
  text: [
    null,
    range(50, 60),
    range(70, 85)
  ],
  heading: [
    null,
    range(40, 60),
    range(75, 90)
  ],
  input: [
    null,
    range(10, 20),
    range(18, 25)
  ],
  complementary: [
    complementary(),
    range(50, 60),
    range(70, 85)
  ]
}

export function renderTheme (color: string) {
  const hsl = convert.hex.hsl(color)
  const result: Record<string, string> = {}
  for (const name in AppTheme) {
    const value = AppTheme[name].map(transformColor(hsl))
    result[`--color-${name}`] = '#' + convert.hsl.hex(value as HSL)
  }
  return result
}
