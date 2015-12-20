import express from 'express'
import mongoose from 'mongoose'

import { getAll, getOne, createEvent } from 'api/Repo.service'

mongoose.connect('mongodb://localhost/statoss', { db: { safe: true } })

const router = express.Router()

router.get('/repos', (req, res) => {
  response(getAll, res)
})

router.get('/repos/:user/:repo', (req, res) => {
  const name = `${req.params.user}/${req.params.repo}`
  response(getOne.bind(this, name), res)
})

router.post('/repos/:user/:repo/events', (req) => {
  const name = `${req.params.user}/${req.params.repo}`
  response(createEvent.bind(this, { name, data: req.body }))
})

function response (fn, res) {
  fn()
    .then(data => { res.status(200).send(data) })
}

export default router
