import express from 'express'
import http, { RequestListener } from 'http'
import https from 'https'
import { isPathExists, readTextFile } from './modules/file'
import { createRenderRoute } from './routes/render'

const HOST = '0.0.0.0'
const HTTP_PORT = 80
const HTTPS_PORT = 443
const PRIVATE_KEY_PATH = './ssl/privkey.pem'
const CERTIFICATE_PATH = './ssl/cert.pem'

async function readCertificate () {
  const [key, cert] = await Promise.all([
    await readTextFile(PRIVATE_KEY_PATH),
    await readTextFile(CERTIFICATE_PATH)
  ])
  return { key, cert }
}

async function createServer (isSecure: boolean, app: RequestListener) {
  return new Promise(resolve => {
    if (isSecure) {
      readCertificate()
        .then(options => https.createServer(options, app))
        .then(server => server.listen(HTTPS_PORT, HOST, () => resolve(HTTPS_PORT)))
    } else {
      http
        .createServer(app)
        .listen(HTTP_PORT, HOST, () => resolve(HTTP_PORT))
    }
  })
}

async function main () {
  const isSecure = await isPathExists('./ssl')
  const app = express()
    .use(express.json())
    .use('/render', createRenderRoute())
    .use('/', express.static('dist/assets'))
  const port = await createServer(isSecure, app)
  console.log(`Pixel Watch Face renderer app is running on ${HOST}:${port}`)
}

main()
