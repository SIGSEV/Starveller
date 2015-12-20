import express from 'express'
import mongoose from 'mongoose'

import { getAll, getOne } from 'api/Repo.service'

mongoose.connect('mongodb://localhost/statoss', { db: { safe: true } })

const router = express.Router()

router.get('/repos', (req, res) => {
  response(getAll, res)
})

router.get('/repos/:user/:repo', (req, res) => {
  response(getOne.bind(this, req.params.user, req.params.repo), res)
})

function response (fn, res) {
  fn()
    .then(data => { res.status(200).send(data) })
    .catch(() => { res.status(500).end() })
}

export default router
