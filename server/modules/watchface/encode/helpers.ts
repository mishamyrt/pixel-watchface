export function fillRandomValues (arr: Uint8Array) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = Math.random() * 255
  }
}
