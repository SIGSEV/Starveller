import { fetchRepo } from 'actions/repo'
import { pushState } from 'redux-router'

export const fetchAndGo = (search) => dispatch => new Promise((resolve, reject) => {

  dispatch(fetchRepo(search))
    .then(() => {
      dispatch(pushState(null, `${search}`))
    })
    .catch(reject)

})
