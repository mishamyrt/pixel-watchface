import { initializePreview } from './components/preview'
import { initializeDownloadButton } from './components/download-button'
import { initializeColorPicker } from './components/color-picker'
import { initializeColorPresets } from './components/color-presets'

function registerServiceWorker () {
  if ('serviceWorker' in navigator) {
    self.addEventListener('load', async () => {
      const container = navigator.serviceWorker
      if (container.controller === null) {
        await container.register('sw.js')
      }
    })
  }
}

function app () {
  initializePreview()
  initializeColorPresets()
  initializeDownloadButton()
  initializeColorPicker()
  registerServiceWorker()
}

document.addEventListener('DOMContentLoaded', app)
