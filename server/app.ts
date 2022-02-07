import express from 'express'
import asyncHandler from 'express-async-handler'
import { PassThrough } from "stream"
import { render } from './render'
import http from 'http'
import https from 'https'
import { isPathExists, readTextFile } from './modules/file'

const PRIVATE_KEY_PATH = './ssl/privkey.pem'
const CERTIFICATE_PATH = './ssl/cert.pem'

async function main() {
    const isProduction = await isPathExists('./ssl')
    const app = express()
    .use(express.json())
    .use('/', express.static('dist/assets'))
    .use('/render', asyncHandler(async (req, res) => {
        const color = req.body.color as string
        if (color.length > 8) {
            res.status(400)
            res.send('')
            return
        }
        const watchface = await render(color)
        console.log(`Rendered ${color}`)
        const readStream = new PassThrough();
        res.set("Content-Type", "application/binary");
        readStream.end(watchface);
        readStream.pipe(res);
    }))
    if (isProduction) {
        https.createServer({
            key: await readTextFile(PRIVATE_KEY_PATH),
            cert: await readTextFile(CERTIFICATE_PATH)
        }, app).listen(443);
    } else {
        http.createServer(app).listen(80)
    }
}

main()