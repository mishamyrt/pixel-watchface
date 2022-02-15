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

function registerReload () {
  const socket = new WebSocket('ws://localhost:3000/')
  socket.onmessage = e => {
    if (e.data !== 'update') return
    window.location.reload()
  }
}

function app () {
  initializePreview()
  initializeColorPresets()
  initializeDownloadButton()
  initializeColorPicker()
  if (process.env.NODE_ENV === 'production') {
    registerServiceWorker()
  } else {
    registerReload()
  }
}

document.addEventListener('DOMContentLoaded', app)
