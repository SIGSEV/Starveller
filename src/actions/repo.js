import r from 'superagent'
import { createAction } from 'redux-actions'

import config from 'config'

const api = config.getApi()

const repoFetch = createAction('REPO_FETCH')
const repoFetched = createAction('REPO_FETCHED')
const repoFail = createAction('REPO_FAIL')

export const fetchRepo = (search) => dispatch => new Promise((resolve, reject) => {

  dispatch(repoFetch())

  r.get(`${api}/repos/${search}`)
    .end((err, res) => {
      if (err) {
        dispatch(repoFail())
        return reject(err)
      }
      dispatch(repoFetched(res.body))
      resolve()
    })

})

export const resetRepo = createAction('REPO_RESET')
