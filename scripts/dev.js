// @ts-check
const nodemon = require('nodemon')
const { stdout, stderr } = require('process')

const FRONTEND_GLOB = 'src/**/*'
const BACKEND_GLIB = 'server/**/*'
const START_CMD = 'npm run build && npm start'

const NODEMON_PARAMS = {
  exec: START_CMD,
  watch: [FRONTEND_GLOB, BACKEND_GLIB],
  ext: 'ts,json,html,scss,svg',
  stdout: false
}

// TODO: Add autoreload
function main () {
  const process = nodemon(NODEMON_PARAMS)
  process.on('start', () => console.clear())
  process.on('stdout', buffer => stdout.write(buffer))
  process.on('stderr', buffer => stderr.write(buffer))
}

main()