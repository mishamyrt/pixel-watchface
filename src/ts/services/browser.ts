import { singletonFrom } from '../utilities'

export class BrowserService {
  themeNode: HTMLMetaElement

  constructor () {
    const node = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    if (!node) {
      throw new Error('Meta theme-color node not found')
    }
    this.themeNode = node
  }

  downloadBlob (name: string, blob: Blob) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob)
    a.href = url
    a.download = name
    a.click()
  }

  setProperties (props: Record<string, string>) {
    for (const key in props) {
      document.body.style.setProperty(key, props[key])
    }
  }

  setThemeColor (color: string) {
    this.themeNode.content = color
  }
}

export const Browser = singletonFrom(BrowserService)
