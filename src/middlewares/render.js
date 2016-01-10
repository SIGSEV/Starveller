import path from 'path'
import React from 'react'
import { Provider } from 'react-redux'
import createLocation from 'history/lib/createLocation'
import { RoutingContext, match } from 'react-router'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'

import { askRepo, setCurrent, fetchTrendingRepos } from 'actions/repos'

import config from 'config'
import routes from 'routes'
import createStore from 'createStore'

import Html from 'Html'

export default (req, res) => {

  const location = createLocation(req.url)

  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if (err) {
      return res.redirect('/fail')
    }

    if (!renderProps) {
      return res.redirect('/fail')
    }

    const store = createStore()

    const { params } = renderProps
    const { owner, reponame } = params

    const init = []

    init.push(store.dispatch(fetchTrendingRepos()))

    if (owner && reponame) {
      init.push(
        store.dispatch(askRepo({ name: `${owner}/${reponame}` }))
          .then(repo => store.dispatch(setCurrent(repo)))
      )
    }

    Promise.all(init).then(() => {

      const app = (
        <Provider store={store}>
          <RoutingContext {...renderProps}/>
        </Provider>
      )

      const state = store.getState()

      const stats = (config.env === 'production')
        ? require(path.join(config.distFolder, 'stats.json'))
        : {}

      const HtmlComponent = (
        <Html
          stats={stats}
          content={renderToString(app)}
          state={state}/>
      )

      const markup = renderToStaticMarkup(HtmlComponent)
      const page = `<!doctype html>${markup}`

      res.end(page)

    }).catch(err => {
      /* eslint-disable no-console */
      console.log(err.stack)
      /* eslint-enable no-console */
      res.redirect('/fail')
    })

  })

}
