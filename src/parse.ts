import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { parse } from './modules/watchface'
import { ParsedWatchface } from './modules/watchface/types'
import { encode, PngDataArray } from 'fast-png'

const OUT_DIR = 'result'

function stringifyMeta(watchface: ParsedWatchface) {
    return JSON.stringify(
        watchface.params,
        (_, v) =>
          typeof v === "bigint"
            ? String(v)
            : (typeof v === "object" && v !== null
              ? (v instanceof Map ? Object.fromEntries(v) : v)
              : v),
        2,
      )
}

readFile('watch.bin')
    .then(buffer => parse(buffer))
    .then(async watchface => {
        await writeFile(join(OUT_DIR, 'meta.json'), stringifyMeta(watchface))
        const list = watchface.resources.map(res => writeFile(join(OUT_DIR, `${res.id}.png`), encode({
            data: res.data as PngDataArray,
            width: res.width,
            height: res.height
        })))
        await Promise.all(list)
    })
