import { lstat, readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { readTextFile } from './modules/file' 
import { BandType, pack, Resource, Watchface } from './modules/watchface'
import sharp from 'sharp'

const RESOURCE_DIR = 'watchface'
const ORIGINAL_COLOR = '#FFDDAA'

/**
 * Collects all files in directory
 */
export async function collectResource(folder: string, hidden = false): Promise<string[]> {
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

function replaceColor(color: string) {
    return (s: string) => s.replaceAll(ORIGINAL_COLOR, color)
}

function readTextFiles (paths: string[]) {
    return Promise.all(paths.map(readTextFile))
}

function renderSVG (content: string): Promise<Buffer> {
    return sharp(Buffer.from(content))
        .png()
        .toBuffer()
}

async function bufferToResource(buffer: Buffer): Promise<Resource> {
    const { data, info } = await sharp(buffer)
        .raw()
        .toBuffer({ resolveWithObject: true })
    return {
        width: info.width,
        height: info.height,
        data: new Uint8Array(data)
    }
}

function waitAll<T>(waits: Promise<T>[]): Promise<T[]> {
    return Promise.all(waits)
} 

function generateResources (color: string) {
    return collectResource(RESOURCE_DIR)
        .then(readTextFiles)
        .then(contents => contents.map(replaceColor(color)))
        .then(svgs => svgs.map(renderSVG))
        .then(waitAll)
        .then(buffers => buffers.map(buffer => bufferToResource(buffer)))
        .then(waitAll)
}

export async function render(color: string) {
    const metaContent = await readFile(join(RESOURCE_DIR, 'meta.json'), { encoding: 'utf-8' })
    const meta = JSON.parse(metaContent)
    const watchface: Watchface = {
        band: BandType.BAND_6,
        params: meta,
        resources: await generateResources(color)
    }
    return pack(watchface)
}
