import q from 'q'
import r from 'superagent'
import webshot from 'webshot'
import { Schema } from 'mongoose'

import Repo from 'api/Repo.model'
import config from 'config'

import { initRepo } from 'api/github.worker'

const githubToken = process.env.GITHUB

/**
 * Fetch all repos summaries
 */
export const getAll = () => {
  return q.nfcall(::Repo.find, {}, 'name summary shot')
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
 * Fetch github stars
 */
const fetchStarPage = (name, page) => {

  return q.Promise((resolve, reject) => {

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

export const fetchStars = (name, fromPage) => {
  return fetchStarPage(name, fromPage)
}

/**
 * Create event
 */
export const createEvent = ({ name, data: { title, link, comment } }) => {
  if (!title && !comment && !link) { return q.reject(new Error('Say something maybe?')) }
  return updateByName(name, { $push: { events: { title, link, comment } } })
}

export const fetchRepo = name => {

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

export const ask = repoName => {
  return getByName(repoName)
    .then(repo => {
      if (!repo) {
        return initRepo(repoName)
      }
      return repo
    })
}

export const shot = repo => {

  const { name } = repo
  const url = `${config.clientUrl}${name}/shot`
  const stream = webshot(url, {
    phantomPath: '/usr/bin/phantomjs',
    shotOffset: {
      top: 70,
      left: 82,
      right: 162,
      bottom: 317
    },
    errorIfJSException: true
  })
  // top: 50, left: 62, right: 124, bottom: 268

  const chunks = []

  stream.on('data', chunk => {
    chunks.push(chunk)
  })

  stream.on('end', () => {
    repo.shot = Buffer.concat(chunks).toString('base64')
    repo.save()
    /* eslint-disable no-console */
    console.log(`[SCREENSHOTED]> ${name}`)
    /* eslint-enable no-console */
  })

}
