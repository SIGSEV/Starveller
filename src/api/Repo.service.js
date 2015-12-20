import q from 'q'
import r from 'superagent'
import _ from 'lodash'
import moment from 'moment'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import Repo from 'api/Repo.model'

dotenv.load()
const githubToken = process.env.GITHUB

mongoose.connect(process.env.MONGO, { db: { safe: true } })

export const getAll = () => {
  return q.nfcall(::Repo.find, {}, { name: 1, starsCount: 1 })
}

export const getByName = name => {
  return q.nfcall(::Repo.findOne, { name })
}

export const updateByName = (name, mods) => {
  return q.nfcall(::Repo.update, { name }, mods)
    .then(() => null)
}

export const getOnePopulated = name => {
  return q.nfcall(::Repo.findOne, { name }, '-stars')
    .then(({ name, description, watchersCount, forksCount, starsCount, events, byYear, byMonth, byWeek, byDay }) => {

      return {
        name,
        description,
        events,
        starsCount,
        watchersCount,
        forksCount,
        byDay: reduceGroup(byDay),
        byWeek: reduceGroup(byWeek),
        byMonth: reduceGroup(byMonth),
        byYear: reduceGroup(byYear)
      }
    })
}

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

export const createEvent = ({ name, data: { title, link, comment } }) => {
  if (!title && !comment && !link) { return q.reject(new Error('Say something maybe?')) }
  return updateByName(name, { $push: { events: { title, link, comment } } })
}

export const fetchStars = (name, hard, isScript) => {

  let _repo

  return getByName(name)
    .then(repo => {
      _repo = repo
      if (isScript) { process.stdout.write('[') }
      return fetchStarPage(name, !repo || hard ? 1 : _repo.lastPage)
    })
    .then(results => {
      if (isScript) { process.stdout.write(']\n') }
      const stars = !_repo || hard ? results : _.reject(_repo.stars, { page: _repo.lastPage }).concat(results)
      const lastPage = Math.ceil(stars.length / 100)

      const starsDates = stars.map(s => s.date)
      const byDay = groupDatesByFormat(starsDates, 'YYYY MM DD')
      const byWeek = groupDatesByFormat(starsDates, 'YYYY ww')
      const byMonth = groupDatesByFormat(starsDates, 'YYYY MM')
      const byYear = groupDatesByFormat(starsDates, 'YYYY')

      return { stars, lastPage, byDay, byWeek, byMonth, byYear }
    })
}

function reduceGroup (group) {

  const now = moment(moment().format('YYYY MM DD'), 'YYYY MM DD').toDate()
  const groupAndNow = group.concat({ value: now, stars: 0 })

  return _.reduce(
    groupAndNow,
    (acc, item, i) => {
      return acc.concat({ x: item.value, y: i > 0 ? acc[i - 1].y + item.stars : item.stars })
    },
    []
  )
}

function groupDatesByFormat (stars, format) {
  return _.reduce(
    _.mapValues(_.groupBy(stars, d => moment(d).format(format)), e => e.length),
    (acc, stars, i) => acc.concat({ value: moment(i, format), stars }),
    []
  ).sort((a, b) => { return moment(a.value, format).isBefore(moment(b.value, format)) ? -1 : 1 })
}

function fetchRepo (name) {

  return q.Promise((resolve, reject) => {
    r.get(`https://api.github.com/repos/${name}`)
      .set('Authorization', `token ${githubToken}`)
      .end((err, res) => {
        if (err) { return reject(err) }

        const {
          description,
          created_at: createdAt,
          stargazers_count: starsCount,
          forks: forksCount,
          subscribers_count: watchersCount
        } = res.body

        resolve({ name, description, createdAt, starsCount, forksCount, watchersCount })
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
