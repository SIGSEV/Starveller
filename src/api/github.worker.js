import chalk from 'chalk'
import { queue } from 'async'
import moment from 'moment'
import _ from 'lodash'
import q from 'q'

import Repo from 'api/Repo.model'
import * as RepoService from 'api/Repo.service'

const concurrency = 5

/* eslint-disable no-console */
const log = console.log.bind(console, '[GITHUB WORKER]> ')
const logErr = msg => { console.log(chalk.red(`[GITHUB WORKER]>  ${msg}`)) }
/* eslint-enable no-console */

const job = (repo, done) => {

  const hard = true
  const { name } = repo

  log(`Starting job for ${name}.`)

  // collect stars
  RepoService.fetchStars(repo, hard ? 1 : repo.cache.lastPage)
    .then(stars => {

      const allStars = hard
        ? stars
        : repo.cache.stars
            .concat(_.reject(stars, s => s.page === repo.cache.lastPage))
            .sort((a, b) => moment(a.date).isBefore(b.date) ? 1 : -1)

      const starsDates = allStars.map(s => s.date)

      // update repo
      _.assign(repo, {
        complete: true,
        cache: {
          lastPage: Math.ceil(allStars.length / 100),
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

export const initRepo = name => {

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
    // prevent fetch too big repos
    if (repo.summary.starsCount > 40000) {
      /* eslint-disable no-console */
      console.log(`repo ${repo.name} is too big. no fetch`)
      /* eslint-enable no-console */
    } else if (!repo.lastFetch || moment(repo.lastFetch).diff(moment(), 'days') < -1) {
      worker.push(repo)
    }
    return _.omit(repo, 'cache')
  })

}

// ---------------------------------------------

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
