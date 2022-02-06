const button = document.querySelector('button')
const presets = document.querySelectorAll('.colorPreset')
const input = document.querySelector('.colorInput input')
const theme = document.querySelector('meta[name="theme-color"]')

presets.forEach(node => {
    node.onchange = () => updateAccentColor(getSelectedColor())
    node.style.backgroundColor = node.value
})

input.onchange = () => {
    updateAccentColor(input.value)
}

function getSelectedColor () {
    const node = document.querySelector('.colorPreset:checked')
    return node.value
}

function updateAccentColor (color) {
    currentColor = color
    document.body.style.setProperty('--accent-color', color);
    theme.setAttribute('content', color);
}

let currentColor = getSelectedColor()

updateAccentColor(currentColor)

button.onclick = () => {
    fetch('/render', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({color: currentColor})
    })
    .then(res => [200, 301].indexOf(res.status) < 0
        ? null
        : res.blob())
    .then(blob => {
        if (!blob) return
        const a = document.createElement('a')
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'pixel.bin';
        a.click();
    });
}