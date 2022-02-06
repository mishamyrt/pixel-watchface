import express from 'express'
import asyncHandler from 'express-async-handler'
import { PassThrough } from "stream"
import { render } from './render'
import http from 'http'
import https from 'https'

const PORT = 80
const HOST = '0.0.0.0'

const app = express()
    .use(express.json())
    .use('/', express.static('src/frontend'))
    .use('/render', asyncHandler(async (req, res) => {
        const color = req.body.color as string
        const watchface = await render(color)
        console.log(watchface)
        const readStream = new PassThrough();
        res.set("Content-Type", "application/binary");
        readStream.end(watchface);
        readStream.pipe(res);
    }))

if (process.env.PRODUCTION) {
    https.createServer({
        key: './ssl/privkey.pem',
        cert: './ssl/cert.pem'
    }, app).listen(443);
} else {
    http.createServer(app).listen(8080)
}