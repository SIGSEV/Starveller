import _ from 'lodash'
import r from 'superagent'
import { pushState } from 'redux-router'
import { createAction } from 'redux-actions'

import config from 'config'

const api = config.getApi()

/**
 * Fetch a single repo
 */

const repoFetch = createAction('REPO_FETCH', basicRepo => basicRepo)
const repoFetched = createAction('REPO_FETCHED')
export const repoResolved = createAction('REPO_RESOLVED')

export const fetchRepo = basicRepo => dispatch => new Promise((resolve, reject) => {

  const { name } = basicRepo

  dispatch(repoFetch(basicRepo))

  r.get(`${api}/repos/${name}`)
    .end((err, res) => {
      if (err) { return reject(err) }
      dispatch(repoFetched(res.body))
      resolve()
    })

})

const cacheRepo = createAction('REPO_CACHE', githubRepo => githubRepo)

export const askRepo = repo => (dispatch, getState) => new Promise((resolve, reject) => {

  const state = getState()

  const repoInCache = _.find(state.list, r => r.name === name)

  if (!repoInCache) {
    dispatch(cacheRepo(repo))
  }

  if (!repo.stars) {

    r.post(`${api}/repos`)
      .send({ name: repo.name })
      .end((err, res) => {
        if (err) { return reject(err) }
        dispatch(repoResolved(res.body))
        resolve()
      })
  }

})

/**
 * Reset the current repo
 */

export const resetRepo = createAction('REPO_RESET')

/**
 * Fetch a basic list of repos
 */

const reposListFetched = createAction('REPOS_LIST_FETCHED')

export const fetchReposList = () => dispatch => new Promise((resolve, reject) => {

  r.get(`${api}/repos`)
    .end((err, res) => {
      if (err) { return reject(err) }
      dispatch(reposListFetched(res.body))
      resolve()
    })

})

/**
 * Navigate to a repo
 */
export const goToRepo = repo => dispatch => {
  dispatch(repoFetched(repo))
  dispatch(pushState(null, `${repo.name}`))
}

/**
 * Fetch a repo, then navigate to its page
 */
export const fetchAndGo = (repo) => dispatch => {

  dispatch(fetchRepo(repo))
    .then(() => { dispatch(goToRepo(repo)) })

}

/**
 * Add a repo to builder
 */
export const chosenChoose = createAction('CHOSEN_CHOOSE')

/**
 * Clear repo cache
 */
export const deleteFromCache = repo => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    r.put(`${api}/repos/${repo._id}`)
      .end((err, res) => {
        if (err) {
          console.log(err)
          return reject(err)
        }
        console.log(res)
      })
  })
}
