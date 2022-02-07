export function downloadFile (blob: Blob, name: string) {
    const a = document.createElement('a')
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = name
    a.click()
}