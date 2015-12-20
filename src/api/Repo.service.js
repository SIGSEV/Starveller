import q from 'q'
import r from 'superagent'
import _ from 'lodash'

import Repo from 'api/Repo.model'

/**
 * API
 */

export const getAll = () => {
  return q.nfcall(::Repo.find, {}, { name: 1, starCount: 1 })
}

export const getOne = (user, repo) => {
  const name = `${user}/${repo}`

  return q.nfcall(::Repo.findOne, { name }, '-stars.page')
    .then(({ name, stars, starCount, events }) => ({
      name,
      events,
      starCount,
      stars: stars.map(s => s.date)
    }))
}

/**
 * Admin area
 */

export const getByName = name => {
  return q.nfcall(::Repo.findOne, { name })
    .then(repo => {
      if (!repo) { return create(name) }
      return repo
    })
}

export const updateById = (_id, mods) => {
  return q.nfcall(::Repo.update, { _id }, mods)
    .then(() => null)
}

export const create = name => {
  return q.nfcall(::Repo.create, { name })
}

export const fetch = (name, hard) => {

  let _repo

  return getByName(name)
    .then(repo => {
      _repo = repo
      process.stdout.write('[')
      return fetchPage(name, hard ? 1 : _repo.lastPage)
    })
    .then(results => {
      process.stdout.write(']\n')
      const stars = _.reject(_repo.stars, { page: _repo.lastPage }).concat(results)
      const lastPage = Math.ceil(stars.length / 100)
      const starCount = stars.length
      return updateById(_repo._id, { stars, lastPage, starCount })
    })
}

function fetchPage (name, page) {

  const githubToken = process.env.GITHUB

  return q.Promise((resolve, reject) => {

    process.stdout.write(':')

    r.get(`https://api.github.com/repos/${name}/stargazers?page=${page}&per_page=100`)
      .set('Authorization', `token ${githubToken}`)
      .set('Accept', 'application/vnd.github.v3.star+json')
      .end((err, res) => {
        if (err) { return reject(err) }

        const stars = res.body.map(star => ({ date: star.starred_at, page }))

        if (res.body.length === 100) {
          return fetchPage(name, ++page)
            .then(data => { resolve(data.concat(stars)) })
            .catch(reject)
        }

        resolve(stars)
      })

  })

}
