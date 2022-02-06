import express from 'express'
import asyncHandler from 'express-async-handler'
import { PassThrough } from "stream"
import { render } from './render'
import http from 'http'
import https from 'https'
import { readTextFile } from './modules/file'

const PORT = 80
const HOST = '0.0.0.0'
const KEY = './ssl/privkey.pem'
const CERT = './ssl/cert.pem'

const app = express()
    .use(express.json())
    .use('/', express.static('src/frontend'))
    .use('/render', asyncHandler(async (req, res) => {
        const color = req.body.color as string
        if (color.length > 8) {
            res.status(400)
            res.send('')
        }
        const watchface = await render(color)
        console.log(`Rendered ${color}`)
        const readStream = new PassThrough();
        res.set("Content-Type", "application/binary");
        readStream.end(watchface);
        readStream.pipe(res);
    }))

async function main() {
    if (process.env.PRODUCTION) {
        https.createServer({
            key: await readTextFile(KEY),
            cert: await readTextFile(CERT)
        }, app).listen(443);
    } else {
        http.createServer(app).listen(8080)
    }
}

main()