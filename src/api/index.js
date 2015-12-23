import express from 'express'

import './db'
import * as repo from 'api/Repo.service'

const router = express.Router()

router.get('/repos', (req, res) => {
  response(repo.getAll, res)
})

router.put('/repos', (req, res) => {
  response(repo.createRepo.bind(this, req.body.name), res)
})

router.get('/repos/:user/:repo', (req, res) => {
  const name = `${req.params.user}/${req.params.repo}`
  response(repo.getOnePopulated.bind(this, name, req.query.months), res)
})

router.post('/repos/:user/:repo/events', (req) => {
  const name = `${req.params.user}/${req.params.repo}`
  response(repo.createEvent.bind(this, { name, data: req.body }))
})

function response (fn, res) {
  fn()
    .then(data => { res.status(200).send(data) })
    .catch(({ message }) => { res.status(400).send({ message }) })
}

export default router
