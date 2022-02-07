import displayIcon from '../assets/display.svg'

export function initializePreview () {
    const previewBody = document.querySelector('.preview-body')!
    return fetch(displayIcon)
        .then(res => res.text())
        .then(content => { previewBody.innerHTML = content })
}