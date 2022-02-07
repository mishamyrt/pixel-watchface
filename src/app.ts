import { downloadFile } from "./modules/file"
import { ColorPresets } from "./modules/presets"
import { postJson } from "./modules/requests"

const button = document.querySelector<HTMLButtonElement>('button')!
const input = document.querySelector<HTMLInputElement>('.colorInput input')!
const theme = document.querySelector('meta[name="theme-color"]')!

let currentColor = ''

const presets = new ColorPresets(
    [...document.querySelectorAll<HTMLInputElement>('.colorPreset')!]
)
presets.onChange(updateAccentColor)

input.onchange = () => {
    updateAccentColor(input.value)
}

function updateAccentColor (color: string) {
    currentColor = color
    document.body.style.setProperty('--accent-color', color);
    theme.setAttribute('content', color);
}

updateAccentColor(currentColor)

button.onclick = async () => {
    const res = await postJson('/render', {color: currentColor})
    if (![200, 301].includes(res.status)) {
        throw new Error('Could not download watch face')
    }
    const blob = await res.blob()
    return downloadFile(blob, 'pixel.bin')
}