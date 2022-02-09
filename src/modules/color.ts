import convert from 'color-convert'
import { HSL } from 'color-convert/conversions'

function background (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    Math.max(color[1] - 45, 10),
    5
  ])
}

function mutedText (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    Math.max(color[1] - 15, 60),
    Math.min(color[2] + 30, 90)
  ])
}

function headingText (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    Math.max(color[1] - 30, 20),
    Math.min(color[2] + 40, 90)
  ])
}

export function generatePallete (color: string): Record<string, string> {
  const hsl = convert.hex.hsl(color)
  return {
    background: '#' + background(hsl),
    muted: '#' + mutedText(hsl),
    heading: '#' + headingText(hsl)
  }
}
