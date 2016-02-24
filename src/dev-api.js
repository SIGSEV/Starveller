import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import api from 'api'
import config from 'config'
import { initSocketServer } from 'api/io'
import { refreshFeatured } from 'api/Repo.service'

const server = express()

server.use(morgan('[API] :method :url :status :response-time ms - :res[content-length]'))

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${config.port}`)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  next()
})

server.use(bodyParser.json())
server.use(api)

initSocketServer()

setTimeout(() => refreshFeatured(), 2e3)

server.listen(config.apiPort, 'localhost', (err) => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`[API] listening at localhost:${config.apiPort} in ${config.env} mode`)
  /* eslint-enable no-console */
})
