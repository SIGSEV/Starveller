import r from 'superagent'
import moment from 'moment'
import { createAction } from 'redux-actions'

import { loadTrending, trendingFinished, loadRepos, reposFinished } from 'actions/loader'
import config from 'config'

const api = config.getApi()

/**
 * Cache utility, use timers reducer
 */

const fnCacheFactory = (action, timerName, minutes) => () => (dispatch, getState) => {

  const state = getState()
  const now = moment()
  const lastFetch = moment(state.timers[timerName])

  if (now.diff(lastFetch, 'minutes') > minutes) {
    dispatch(action())
  }

}

/**
 * Get all repos
 */

const reposFetched = createAction('REPOS_FETCHED')

export const fetchAllRepos = () => dispatch => {
  return new Promise((resolve, reject) => {

    dispatch(loadRepos())

    r.get(`${api}/repos`)
      .end((err, res) => {
        dispatch(reposFinished())
        if (err) { return reject(err) }

        const repos = res.body
        dispatch(reposFetched(repos))
        resolve(repos)
      })
  })
}

export const refreshAllRepos = fnCacheFactory(fetchAllRepos, 'all', 1)

/**
 * Get random repos
 */

const trendingFetched = createAction('TRENDING_FETCHED')

export const fetchTrendingRepos = () => dispatch => {
  return new Promise((resolve, reject) => {

    dispatch(loadTrending())

    r.get(`${api}/random-repos`)
      .end((err, res) => {
        dispatch(trendingFinished())
        if (err) { return reject(err) }

        dispatch(trendingFetched(res.body))
        resolve()
      })
  })
}

export const refreshTrendingRepos = fnCacheFactory(fetchTrendingRepos, 'trending', 1)

export const resetCurrent = createAction('RESET_CURRENT')
export const setCurrent = createAction('SET_CURRENT', repo => repo)

/**
 * Ask for a repo
 */
export const askRepo = repo => dispatch => new Promise((resolve, reject) => {
  if (repo.stars) { return resolve() }
  r.get(`${api}/repos/${repo.name}`)
    .end((err, res) => {
      if (err) { return reject(err) }
      const repo = res.body
      dispatch(repoResolved(repo))
      resolve(repo)
    })
})

export const askAndSetCurrent = repo => dispatch => {
  dispatch(setCurrent(repo))
  return dispatch(askRepo(repo))
    .then(repo => dispatch(setCurrent(repo)))
}

export const repoResolved = createAction('REPO_RESOLVED', repo => repo)
