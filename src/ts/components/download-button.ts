import { API } from '../services/api'
import { Browser } from '../services/browser'
import { Color } from '../services/color'

const BUTTON_SELECTOR = 'button.__filled'

export function initializeDownloadButton () {
  const node = document.querySelector<HTMLButtonElement>(BUTTON_SELECTOR)
  if (!node) {
    throw new Error('Download button not found')
  }
  node.onclick = async () => {
    const blob = await API.render(Color.get())
    return await Browser.downloadBlob('pixel.bin', blob)
  }
}
