import chalk from 'chalk'
import { queue } from 'async'
import moment from 'moment'
import _ from 'lodash'
import q from 'q'

import config from 'config'

import Repo from 'api/Repo.model'
import * as RepoService from 'api/Repo.service'

const concurrency = 2

/* eslint-disable no-console */
const log = console.log.bind(console, '[GITHUB WORKER]> ')
const logErr = msg => { console.log(chalk.red(`[GITHUB WORKER]>  ${msg}`)) }
/* eslint-enable no-console */

const job = ({ repo, fullRefresh }, done) => {

  const { name } = repo

  log(`Starting job for ${name}.`)

  // collect stars
  RepoService.fetchStars(repo, fullRefresh ? 1 : repo.cache.lastPage)
    .then(stars => {

      const allStars = fullRefresh
        ? stars
        : stars.concat(_.reject(repo.cache.stars, s => s.page === repo.cache.lastPage))
          .sort((a, b) => moment(a.date).isBefore(b.date) ? 1 : -1)

      const starsDates = allStars.map(s => s.date)

      // update repo
      _.assign(repo, {
        complete: true,
        cache: {
          lastPage: Math.ceil(allStars.length / 100),
          rank: getRepoRank(starsDates),
          stars: allStars
        },
        stars: {
          byDay: groupDatesByFormat(starsDates, 'YYYY MM DD')
        }
      })

      // save
      return q.nfcall(::repo.save)

    })
    .then(() => {
      log(`Finished work for ${name}.`)
      done()
    })
    .catch(err => {
      logErr(`${name}: ${err}`)
      done(err)
    })

}

const worker = queue(job, concurrency)

// expose event handler

const listeners = []

worker.onFinish = (cb) => { listeners.push(cb) }

worker.drain = (...args) => {
  listeners.forEach(listener => listener.call(listeners, args))
}

export default worker

export const initRepo = (name, fullRefresh) => {

  log(`==> INITING REPO ${name}, BRO, should I force, bro? ${fullRefresh}`)

  // fetch repo from db, and summary from github
  return q.all([
    RepoService.getByName(name),
    RepoService.fetchRepo(name)
  ])

  // collect summary from db, and github
  .then(([repoFromDb, repoFromGithub]) => {

    // if repo exist in db, update it, else create it
    if (repoFromDb) {
      _.assign(repoFromDb, { ...repoFromGithub, complete: false })
      return q.nfcall(::repoFromDb.save)
        .then(() => repoFromDb)
    }

    return q.nfcall(::Repo.create, repoFromGithub)

  })

  .then(repo => {

    const shouldFetchStars = !!fullRefresh
      || !repo.lastFetch
      || moment(repo.lastFetch).diff(moment(), 'days') < -1

    if (shouldFetchStars) {
      worker.push({ repo, fullRefresh })
    }

    return _.omit(repo, 'cache')
  })

}

// ---------------------------------------------

function getRepoRank (starsDates) {

  const oneWeekBefore = moment().subtract(7, 'days')
  const relevant = starsDates.filter(date => moment(date).isAfter(oneWeekBefore))

  const starsCount = relevant.length

  const rank = config.ranks.reduce((res, cur, i) => {
    if (starsCount >= cur) { return i + 2 }
    return res
  }, 1)

  // Little security, just in case
  return rank > 5 ? 5 : rank

}

function groupDatesByFormat (stars, format) {

  const grouppedStars = _.groupBy(stars, d => moment(d).format(format))
  const mappedStars = _.mapValues(grouppedStars, e => e.length)
  const reducedStars = _.reduce(
    mappedStars,
    (acc, stars, i) => acc.concat({ date: moment(i, format), stars }),
    []
  )

  return reduceGroup(
    reducedStars
      .sort((a, b) => { return moment(a.date, format).isBefore(moment(b.date, format)) ? -1 : 1 })
  )
}

function reduceGroup (group) {
  return _.reduce(
    group,
    (acc, item, i) => {
      return acc.concat({
        date: item.date.toDate(),
        stars: i > 0 ? acc[i - 1].stars + item.stars : item.stars
      })
    },
    []
  )
}
