import express from 'express'
import asyncHandler from 'express-async-handler'
import { PassThrough } from "stream"
import { render } from './render'

const PORT = 80
const HOST = '0.0.0.0'

express()
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
    .listen(PORT, HOST, () => {
        console.log(`Started on ${HOST}:${PORT}`)
    })