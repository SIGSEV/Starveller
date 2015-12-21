import r from 'superagent'
import { pushState } from 'redux-router'
import { createAction } from 'redux-actions'

import config from 'config'

import { startLoader, stopLoader } from 'actions/loader'

const api = config.getApi()

/**
 * Fetch a single repo
 */

const repoFetched = createAction('REPO_FETCHED')

export const fetchRepo = (search) => dispatch => new Promise((resolve, reject) => {

  dispatch(startLoader('global'))

  r.get(`${api}/repos/${search}`)
    .end((err, res) => {
      dispatch(stopLoader('global'))
      if (err) { return reject(err) }
      dispatch(repoFetched(res.body))
      resolve()
    })

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
 * Fetch a repo, then navigate to its page
 */

export const fetchAndGo = (search) => dispatch => {

  dispatch(fetchRepo(search))
    .then(() => { dispatch(pushState(null, `${search}`)) })

}
