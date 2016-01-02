import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'

import config from 'config'
import api from 'api'
import render from 'middlewares/render'

const server = express()

server.use(morgan('dev'))

if (config.env === 'development') {
  require('middlewares/dev-server').default(server)
}

if (config.env === 'production') {
  server.use(compression())
  server.use('/dist', express.static(config.distFolder))
  server.use('/api', api)
  server.use('/favicon.ico', (req, res) => {
    res.sendFile(path.join(config.assetsFolder, 'favicon.ico'))
  })
}

server.use('/assets', express.static(config.assetsFolder))
server.use(render)

server.listen(config.port, 'localhost', err => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`listening at localhost:${config.port} in ${config.env} mode`)
  /* eslint-enable no-console */
})
