import { RequestHandler, Router } from 'express'
import asyncHandler from 'express-async-handler'
import { PassThrough } from 'stream'
import { render } from '../modules/pixel'

export function createRenderRoute () {
  const handleRequest: RequestHandler = async (req, res) => {
    const color = req.body.color as string
    if (!color || color.length > 8) {
      res.status(400)
      res.send('')
      return
    }
    const watchface = await render(color)
    res.set('Content-Type', 'application/binary')
    console.log(`Rendered ${color}`)
    new PassThrough()
      .end(watchface)
      .pipe(res)
  }

  return Router()
    .post('/', asyncHandler(handleRequest))
}
