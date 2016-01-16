import _ from 'lodash'
import express from 'express'
import { shuffle } from 'lodash'

import './db'
import * as repo from 'api/Repo.service'

const router = express.Router()

const lightRepo = r => _.omit(r.toObject(), ['cache', 'shot', 'stars'])
const fullRepo = r => _.omit(r.toObject(), ['cache', 'shot'])

router.get('/repos', (req, res) => {
  repo.getAll()
    .then(repos => res.send(repos.map(lightRepo)))
    .catch(err => res.send(err.code || 500, err))
})

router.get('/random-repos', (req, res) => {
  repo.getAll()
    .then(repos => shuffle(repos).slice(0, 4))
    .then(repos => res.send(repos.map(lightRepo)))
    .catch(err => res.send(err.code || 500, err))
})

router.post('/repos', (req, res) => {
  repo.ask(req.body.name)
    .then(lightRepo)
    .then(repo => res.send(repo))
    .catch(err => res.send(err.code || 500, err))
})

router.put('/repos', (req, res) => {
  response(repo.createRepo.bind(this, req.body.name), res)
})

router.delete('/repos', (req, res) => {
  repo.removeByName(req.body.name)
    .then(() => res.sendStatus(200))
    .catch(err => res.send(err.code || 500, err))
})

router.get('/repos/:user/:repo', (req, res) => {
  const name = `${req.params.user}/${req.params.repo}`
  repo.ask(name)
    .then(fullRepo)
    .then(repo => res.send(repo))
    .catch(err => res.send(err.code || 500, err))
})

router.get('/repos/:user/:repo/bars', (req, res) => {
  const name = `${req.params.user}/${req.params.repo}`
  repo.getBars(name, req.query.n)
    .then(stars => res.send(stars))
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
