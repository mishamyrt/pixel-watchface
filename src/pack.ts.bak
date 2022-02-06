import { BandType, pack, Resource, Watchface } from './modules/watchface'
import { readFile, readdir, writeFile } from 'fs/promises'
import { decode } from 'fast-png'
import { join } from 'path/posix'


const OUT_DIR = 'result'

function extractNumber (s: string) {
    return parseInt(s.split('.')[0])
}

async function readResource (): Promise<Resource[]> {
    const files = await readdir(OUT_DIR)
    const names = files
        .filter(name => name.endsWith('.png'))
        .sort((a, b) => extractNumber(a) - extractNumber(b))
    const buffers = await Promise.all(
        names.map(name => readFile(join(OUT_DIR, name)))
    ) 
    return buffers
        .map(buffer => decode(buffer))
        .map(image => ({
            width: image.width,
            height: image.height,
            data: image.data as Uint8Array
        }))
}

export async function packWatchface () {
    const metaContent = await readFile(join(OUT_DIR, 'meta.json'), { encoding: 'utf-8' })
    const meta = JSON.parse(metaContent)
    const resources = await readResource()
    const watchface: Watchface = {
        band: BandType.BAND_6,
        params: meta,
        resources
    }
    return pack(watchface)
}

export async function packFile () {
    const watchface = await packWatchface()
    await writeFile(join(OUT_DIR, 'watch.bin'), watchface)
}

// packFile()
// const packed = pack(wf);