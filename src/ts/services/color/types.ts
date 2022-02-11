export interface Theme {
  background: string
  card: string
}

export type ValueTransformer = null | ((v: number) => number)

export type ColorTransformers = [ValueTransformer, ValueTransformer, ValueTransformer]

export type ThemeMap = {
  [key: string]: ColorTransformers
}
