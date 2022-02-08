export function generateUnknownChildren (size: number) {
  return Object.fromEntries(
    new Array(size)
      .fill(0)
      .map((_, i) => [i + 1, { name: `unknown${i + 1}` }])
  )
}
