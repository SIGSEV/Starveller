import q from 'q'
import r from 'superagent'
import _ from 'lodash'
import moment from 'moment'

import Repo from 'api/Repo.model'

/**
 * API
 */

export const getAll = () => {
  return q.nfcall(::Repo.find, {}, { name: 1, starCount: 1 })
}

export const getOne = (name, months = 2) => {
  return q.nfcall(::Repo.findOne, { name }, '-stars.page')
    .then(({ name, stars, starCount, events }) => {

      const filteredStars = months ? _.filter(stars, s => moment().diff(s.date, 'month') <= months) : stars

      const reduced = _.reduce(
        _.mapValues(
          _.groupBy(filteredStars.map(s => s.date), date => moment(date).format('YYYY-MM-DD')),
          el => el.length
        ),
        (res, val, key) => { return res.concat({ x: new Date(key), y: val }) },
        []
      )
        .sort((a, b) => {
          return moment(a.x).isBefore(moment(b.x)) ? -1 : 1
        })

      let acc = starCount - filteredStars.length
      reduced.forEach(el => {
        el.y += acc
        acc = el.y
      })

      return {
        name,
        events,
        starCount,
        stars: reduced
      }
    })
}

export const createEvent = ({ name, data: { title, link, comment } }) => {
  if (!title && !comment && !link) { return q.reject(new Error('Say something maybe?')) }
  return updateByName(name, { $push: { events: { title, link, comment } } })
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

export const updateByName = (name, mods) => {
  return q.nfcall(::Repo.update, { name }, mods)
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
      const stars = hard ? results : _.reject(_repo.stars, { page: _repo.lastPage }).concat(results)
      const lastPage = Math.ceil(stars.length / 100)
      const starCount = stars.length
      return updateByName(_repo.name, { stars, lastPage, starCount })
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
