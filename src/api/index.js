import _ from 'lodash'
import express from 'express'
import { shuffle } from 'lodash'

import './db'
import * as repo from 'api/Repo.service'

const router = express.Router()

router.get('/repos', (req, res) => {
  repo.getAll()
    .then(repos => res.send(repos.map(r => r.toObject())))
    .catch(err => res.send(err.code || 500, err))
})

router.get('/random-repos', (req, res) => {
  repo.getAll()
    .then(repos => shuffle(repos).slice(0, 4))
    .then(repos => res.send(repos.map(r => r.toObject())))
    .catch(err => res.send(err.code || 500, err))
})

router.post('/repos', (req, res) => {
  repo.ask(req.body.name)
    .then(repo => _.omit(repo.toObject(), ['cache', 'shot']))
    .then(repo => res.send(repo))
    .catch(err => res.send(err.code || 500, err))
})

router.put('/repos', (req, res) => {
  response(repo.createRepo.bind(this, req.body.name), res)
})

router.get('/repos/:user/:repo', (req, res) => {
  const name = `${req.params.user}/${req.params.repo}`
  repo.ask(name)
    .then(repo => _.omit(repo.toObject(), ['cache', 'shot']))
    .then(repo => res.send(repo))
    .catch(err => res.send(err.code || 500, err))
})

router.post('/repos/:user/:repo/events', (req) => {
  const name = `${req.params.user}/${req.params.repo}`
  response(repo.createEvent.bind(this, { name, data: req.body }))
})

function response (fn, res) {
  fn()
    .then(data => { res.status(200).send(data) })
    .catch(err => {
      const { stack, message } = err
      /* eslint-disable no-console */
      console.log(stack)
      /* eslint-enable no-console */
      res.status(400).send({ message })
    })
}

export default router
