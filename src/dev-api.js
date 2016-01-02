import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'

import api from 'api'
import config from 'config'

const server = express()

server.use(morgan('[API] :method :url :status :response-time ms - :res[content-length]'))

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', `http://localhost:${config.port}`)
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

server.use(bodyParser.json())
server.use(api)

server.listen(config.apiPort, 'localhost', (err) => {
  /* eslint-disable no-console */
  if (err) { return console.log(err) }
  console.log(`[API] listening at localhost:${config.apiPort} in ${config.env} mode`)
  /* eslint-enable no-console */
})
