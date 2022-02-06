import { readFile } from "fs/promises";

export function readTextFile (path: string) {
    return readFile(path, { encoding: 'utf-8' })
}