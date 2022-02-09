import convert from 'color-convert'
import { HSL } from 'color-convert/conversions'

function range (value: number, down: number, up: number) {
  return down + ((up - down) * (value / 100))
}

// 70% 70-80
// 80 - 70 (10)

function background (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 30, 40),
    range(color[2], 5, 6)
  ])
}

function mutedText (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 50, 60),
    range(color[2], 70, 85)
  ])
}

function headingText (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 40, 60),
    range(color[2], 75, 90)
  ])
}

function card (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 7, 15),
    range(color[2], 8, 15)
  ])
}

function text (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 55, 65),
    range(color[2], 80, 90)
  ])
}

function complementary (color: HSL): string {
  let hue = color[0] - 180
  if (hue < 0) {
    hue += 360
  }
  return convert.hsl.hex([
    hue,
    range(color[1], 50, 60),
    range(color[1], 70, 85)
  ])
}

function input (color: HSL): string {
  return convert.hsl.hex([
    color[0],
    range(color[1], 10, 20),
    range(color[2], 18, 25)
  ])
}

export function generatePallete (color: string): Record<string, string> {
  const hsl = convert.hex.hsl(color)
  return {
    background: '#' + background(hsl),
    muted: '#' + mutedText(hsl),
    heading: '#' + headingText(hsl),
    card: '#' + card(hsl),
    text: '#' + text(hsl),
    complementary: '#' + complementary(hsl),
    input: '#' + input(hsl)
  }
}
