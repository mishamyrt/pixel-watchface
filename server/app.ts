import express from 'express'
import http from 'http'
import https from 'https'
import { isPathExists, readTextFile } from './modules/file'
import { createRenderRoute } from './routes/render'

const PRIVATE_KEY_PATH = './ssl/privkey.pem'
const CERTIFICATE_PATH = './ssl/cert.pem'

async function main () {
  const isSecure = await isPathExists('./ssl')
  const app = express()
    .use(express.json())
    .use('/render', createRenderRoute())
    .use('/', express.static('dist/assets'))

  if (isSecure) {
    https.createServer({
      key: await readTextFile(PRIVATE_KEY_PATH),
      cert: await readTextFile(CERTIFICATE_PATH)
    }, app).listen(443)
  } else {
    http.createServer(app).listen(80)
  }
}

main()
