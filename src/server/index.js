import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'

import config from 'config'
import render from 'server/middlewares/render'

const server = express()

const morganFormat = config.env === 'development'
  ? 'dev'
  : ':date[clf] :remote-addr :method :url :status :response-time ms - :res[content-length]'

server.use(morgan(morganFormat))

if (config.env === 'development') {
  require('server/middlewares/webpack').default(server)
}

if (config.env === 'production') {

  const { initSocketServer } = require('api/io').default
  const { refreshTrending } = require('api/Repo.service').default

  server.use(compression())
  server.use(bodyParser.json())
  server.use('/dist', express.static(config.distFolder))
  server.use(config.apiUrl, require('api').default)

  require('api/cron')

  initSocketServer()
  refreshTrending()
}

server.use('/assets', express.static(config.assetsFolder))
server.use(render)

server.listen(config.port, 'localhost', err => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`[APP] listening at localhost:${config.port} in ${config.env} mode`)
  /* eslint-enable no-console */
})
