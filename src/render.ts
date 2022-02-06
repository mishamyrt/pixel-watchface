import { lstat, readdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import { readTextFile } from './modules/file' 
import { BandType, pack, Resource, Watchface } from './modules/watchface'
import { decode } from 'fast-png'
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

// export function copyFiles(files) {
//     return Promise.all(
//         files.map(([oldPath, newPath]) => copyFile(oldPath, newPath))
//     )
// }

// async function readResource (): Promise<Resource[]> {
//     const files = await readdir(RESOURCE_DIR)
//     const names = files
//         .filter(name => name.endsWith('.png'))
//         .sort((a, b) => extractNumber(a) - extractNumber(b))
//     const buffers = await Promise.all(
//         names.map(name => readFile(join(OUT_DIR, name)))
//     ) 
//     return buffers
//         .map(buffer => decode(buffer))
//         .map(image => ({
//             width: image.width,
//             height: image.height,
//             data: image.data as Uint8Array
//         }))
// }

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

function bufferToResource(buffer: Buffer): Resource {
    const image = decode(buffer)
    console.log(image.depth, image.channels)
    return {
        width: image.width,
        height: image.height,
        data: new Uint8Array(image.data)
    }
}

function generateResources (color: string) {
    return collectResource(RESOURCE_DIR)
        .then(readTextFiles)
        .then(contents => contents.map(replaceColor(color)))
        .then(svgs => svgs.map(renderSVG))
        .then(waits => Promise.all(waits))
        // .then(async pngs => {
        //     await pngs.map((png, index) => writeFile(`out/${index}.png`, png))
        //     return pngs
        // })
        .then(buffers => buffers.map(buffer => bufferToResource(buffer)))
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
