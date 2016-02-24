import r from 'superagent'
import { push } from 'redux-router'
import moment from 'moment'
import { createAction } from 'redux-actions'

import {
  askRepoStart,
  askRepoFinish,
  loadFeatured,
  featuredFinished,
  loadRepos,
  reposFinished
} from 'actions/loader'

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
 * Get featured repos
 */

const featuredFetched = createAction('FEATURED_FETCHED')

export const fetchFeaturedRepos = () => dispatch => {
  return new Promise((resolve, reject) => {

    dispatch(loadFeatured())

    r.get(`${api}/featured`)
      .end((err, res) => {
        dispatch(featuredFinished())
        if (err) { return reject(err) }

        dispatch(featuredFetched(res.body))
        resolve()
      })
  })
}

export const refreshFeaturedRepos = fnCacheFactory(fetchFeaturedRepos, 'featured', 1)

export const resetCurrent = createAction('RESET_CURRENT')
export const setCurrent = createAction('SET_CURRENT', repo => repo)

export const goToRepo = repo => dispatch => {
  dispatch(setCurrent(repo))
  dispatch(push(`${repo.name}`))
}

/**
 * Ask for a repo
 */
export const askRepo = repo => dispatch => new Promise((resolve, reject) => {
  if (repo.stars) { return resolve(repo) }
  dispatch(askRepoStart())
  r.get(`${api}/repos/${repo.name}`)
    .end((err, res) => {
      dispatch(askRepoFinish())
      if (err) { return reject(err) }
      const repo = res.body
      dispatch(repoResolved(repo))
      resolve(repo)
    })
})

export const askAndGo = repo => dispatch => {
  return dispatch(askRepo(repo))
    .then(repo => dispatch(goToRepo(repo)))
}

export const askAndSetCurrent = repo => dispatch => {
  dispatch(setCurrent(repo))
  return dispatch(askRepo(repo))
    .then(repo => dispatch(setCurrent(repo)))
}

/**
 * Delete repo
 */
const repoDeleted = createAction('REPO_DELETED')

export const deleteRepo = repo => dispatch => {
  r.delete(`${api}/repos`)
    .send(repo)
    .end((err) => {
      if (err) { return }
      dispatch(repoDeleted(repo._id))
    })
}

/**
 * Refresh repo
 */
export const refreshRepo = (repo, full) => dispatch => {
  r.put(`${api}/repos/${repo._id}/refresh`)
    .send({ name: repo.name, full })
    .end((err, res) => {
      if (err) { return }
      dispatch(repoResolved(res.body))
    })
}

export const repoResolved = createAction('REPO_RESOLVED', repo => repo)

const selectRepo = createAction('REPO_SELECTED', repo => repo)

export const fetchAndSelectRepo = repoName => dispatch => {
  dispatch(askRepo({ name: repoName }))
    .then(r => dispatch(selectRepo(r)))
}

export const deselectRepo = createAction('REPO_DESELECTED', repo => repo)
