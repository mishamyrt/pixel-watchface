import { lstat, readdir, readFile } from 'fs/promises'
import { join } from 'path'

export function readTextFile (path: string) {
  return readFile(path, { encoding: 'utf-8' })
}

export async function collectResource (folder: string, hidden = false): Promise<string[]> {
  const result = []
  const files = await readdir(folder)
  for (const file of files) {
    if (file.endsWith('.json') || (!hidden && file.startsWith('.'))) {
      continue
    }
    const path = join(folder, file)
    const stat = await lstat(path)
    if (stat.isDirectory()) {
      result.push(...await collectResource(path))
    } else {
      result.push(path)
    }
  }
  return result
}

export async function isPathExists (path: string) {
  try {
    await lstat(path)
    return true
  } catch {
    return false
  }
}
