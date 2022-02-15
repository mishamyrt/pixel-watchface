// @ts-check
const { stdout, stderr } = require('process')
const nodemon = require('nodemon')
const WebSocket = require('ws')

const FRONTEND_GLOB = 'src/**/*'
const BACKEND_GLIB = 'server/**/*'
const START_CMD = 'NODE_ENV=dev npm run build && npm start'
const WS_PORT = 3000

const NODEMON_PARAMS = {
  exec: START_CMD,
  watch: [FRONTEND_GLOB, BACKEND_GLIB],
  ext: 'ts,json,html,scss,svg',
  stdout: false
}

function main () {
  const clients = new Set()
  const socket = new WebSocket.Server({ port: WS_PORT })
  socket.on('connection', socket => clients.add(socket))
  const process = nodemon(NODEMON_PARAMS)
  process.on('start', () => console.clear())
  process.on('stdout', buffer => {
    stdout.write(buffer)
    const message = buffer.toString()
    if (message.includes('app is running')) {
      clients.forEach(c => c.send('update'))
      clients.clear()
    }
  })
  process.on('stderr', buffer => stderr.write(buffer))
}

main()
