interface ClassConstructor<T>{
  new(): T
}

declare global {
  interface Window {
    __classMemo: Map<ClassConstructor<unknown>, unknown>
  }
}

export function singletonFrom<T> (Prototype: ClassConstructor<T>): T {
  if (!window.__classMemo) {
    window.__classMemo = new Map()
  }
  const savedInstance = window.__classMemo.get(Prototype)
  if (savedInstance) {
    return savedInstance as T
  }
  const instance = new Prototype()
  window.__classMemo.set(Prototype, instance)
  return instance
}
