type ChangeHandler = (color: string) => void

export class ColorPresets {
    private changeHandler: ChangeHandler = () => undefined
    private color = ''

    constructor (
        private buttons: HTMLInputElement[]
    ) {
      buttons.forEach(node => {
        node.onchange = () => this.handleChnage()
        // node.onclick = () => {}
        node.style.setProperty('--item-color', node.value)
      })
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
