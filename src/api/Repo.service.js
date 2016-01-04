import q from 'q'
import r from 'superagent'
import _ from 'lodash'

import Repo from 'api/Repo.model'

const githubToken = process.env.GITHUB

/**
 * Fetch all repos summaries
 */
export const getAll = () => {
  return q.nfcall(::Repo.find, {}, 'name summary')
}

/**
 * Get a full repo
 */
export const getByName = name => {
  return q.nfcall(::Repo.findOne, { name })
}

/**
 * Remove a repo
 */
export const removeByName = name => {
  return q.nfcall(::Repo.remove, { name })
}

/**
 * Update repo
 */
export const updateByName = (name, mods) => {
  return q.nfcall(::Repo.update, { name }, mods)
    .then(() => null)
}

/**
 * Get a populated repo, without cache
 */
export const getOnePopulated = name => {
  return q.nfcall(::Repo.findOne, { name }, '-cache')
}

/**
 * Create a repo
 */
export const createRepo = (name, hard, isScript) => {
  if (!name) { return q.reject(new Error('Bitch plz.')) }

  let _data, _repo

  return getByName(name)
    .then(repo => {
      if (repo && !isScript) { throw new Error('Repo already created.') }
      _repo = repo
      return fetchRepo(name)
    })
    .then(data => {
      _data = data
      return fetchStars(name, hard, isScript)
    })
    .then(starsData => {
      const final = _.merge(starsData, _data)
      if (_repo) { return updateByName(name, final) }
      return q.nfcall(::Repo.create, final)
    })
}

/**
 * Fetch github stars
 */
export const fetchStars = (repo, fromPage) => {

  process.stdout.write('[')

  return fetchStarPage(repo.name, fromPage)
    .then(stars => {
      process.stdout.write(']\n')
      return stars
    })
}

/**
 * Create event
 */
export const createEvent = ({ name, data: { title, link, comment } }) => {
  if (!title && !comment && !link) { return q.reject(new Error('Say something maybe?')) }
  return updateByName(name, { $push: { events: { title, link, comment } } })
}

export const fetchRepo = (name) => {

  return q.Promise((resolve, reject) => {
    r.get(`https://api.github.com/repos/${name}`)
      .set('Authorization', `token ${githubToken}`)
      .end((err, res) => {
        if (err) { return reject(err) }

        const src = res.body

        resolve({
          name,
          summary: {
            lastFetch: new Date(),
            createdAt: src.created_at,
            description: src.description,
            starsCount: src.stargazers_count,
            forksCount: src.forks,
            watchersCount: src.subscribers_count
          }
        })
      })
  })

}

function fetchStarPage (name, page) {

  return q.Promise((resolve, reject) => {

    process.stdout.write(':')

    r.get(`https://api.github.com/repos/${name}/stargazers?page=${page}&per_page=100`)
      .set('Authorization', `token ${githubToken}`)
      .set('Accept', 'application/vnd.github.v3.star+json')
      .end((err, res) => {
        if (err) { return reject(err) }

        const stars = res.body.map(star => ({ date: star.starred_at, page }))

        if (res.body.length === 100) {
          return fetchStarPage(name, ++page)
            .then(data => { resolve(data.concat(stars)) })
            .catch(reject)
        }

        resolve(stars)
      })

  })

}
