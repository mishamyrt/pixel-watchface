import displayIcon from '../../assets/display.svg'

export function initializePreview () {
  const previewBody = document.querySelector('.preview-body')
  if (!previewBody) {
    throw new Error('Preview body not found')
  }
  return fetch(displayIcon)
    .then(res => res.text())
    .then(content => { previewBody.innerHTML = content })
}
