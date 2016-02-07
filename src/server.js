import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import config from 'config'
import api from 'api'
import { initSocketServer } from 'api/io'
import render from 'middlewares/render'

const server = express()

const morganFormat = config.env === 'development'
  ? 'dev'
  : ':date[clf] :remote-addr :method :url :status :response-time ms - :res[content-length]'

server.use(morgan(morganFormat))

if (config.env === 'development') {
  require('middlewares/dev-server').default(server)
}

if (config.env === 'production') {
  server.use(compression())
  server.use(bodyParser.json())
  server.use('/dist', express.static(config.distFolder))
  server.use('/api', api)
  server.use('/favicon.ico', (req, res) => {
    res.sendFile(path.join(config.assetsFolder, 'favicon.ico'))
  })

  require('api/cron')

  initSocketServer()
}

server.use('/assets', express.static(config.assetsFolder))
server.use(render)

server.listen(config.port, 'localhost', err => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`listening at localhost:${config.port} in ${config.env} mode`)
  /* eslint-enable no-console */
})
